import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {
  QUIZ_QUESTIONS,
  STARTER_MOVIES,
  STREAMING_SERVICES,
} from './src/shared/catalog.ts';
import {
  isSafeHttpUrl,
  matchPeriodRomancesForServices,
  normalizeStreamingServices,
  sanitizeSalutation,
  validateMovieQuery,
  validateQuizAnswers,
} from './src/shared/validation.ts';
import {
  decodeInvitationToken,
  encodeInvitationToken,
} from './src/server/tokenCodec.ts';
import {
  fetchMercyVetoRomances,
  generateRegencyPitch,
  generateRegencyPoster,
  lookupMovieWithGrounding,
} from './src/server/geminiService.ts';
import type {
  DisguisedPitchResponse,
  InvitationMeta,
  InvitationPayload,
  MovieDossier,
  RevealResponse,
  TropeTranslation,
} from './src/shared/types.ts';

interface StoredRevealBundle {
  disguisedTitle: string;
  austenFidelityHeadline: string;
  austenFidelitySummary: string;
  tropeTranslations: TropeTranslation[];
  createdAt: number;
}

const revealStore = new Map<string, StoredRevealBundle>();
const MAX_REVEAL_CACHE = 200;

function saveRevealBundle(bundle: StoredRevealBundle): string {
  if (revealStore.size >= MAX_REVEAL_CACHE) {
    const oldestKey = revealStore.keys().next().value;
    if (oldestKey) revealStore.delete(oldestKey);
  }
  const nonce = crypto.randomBytes(12).toString('base64url');
  revealStore.set(nonce, bundle);
  return nonce;
}

function resolveMovieFromPayload(payload: InvitationPayload): MovieDossier | null {
  if (payload.presetId) {
    return STARTER_MOVIES.find((m) => m.id === payload.presetId) ?? null;
  }
  return payload.customMovie ?? null;
}

function sanitizeCustomMovie(raw: unknown): MovieDossier | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  if (typeof m.title !== 'string' || typeof m.synopsis !== 'string') {
    return null;
  }
  const title = m.title.trim().slice(0, 120);
  const synopsis = m.synopsis.trim().slice(0, 900);
  if (!title || !synopsis) return null;

  const cast = Array.isArray(m.cast)
    ? m.cast
        .filter(
          (c): c is Record<string, unknown> =>
            Boolean(c) &&
            typeof c === 'object' &&
            typeof (c as Record<string, unknown>).actor === 'string' &&
            typeof (c as Record<string, unknown>).character === 'string',
        )
        .slice(0, 5)
        .map((c) => ({
          actor: String(c.actor).trim().slice(0, 80),
          character: String(c.character).trim().slice(0, 80),
          roleSummary:
            typeof c.roleSummary === 'string'
              ? c.roleSummary.trim().slice(0, 180)
              : 'Featured character.',
        }))
    : [];

  const keyPlotBeats = Array.isArray(m.keyPlotBeats)
    ? m.keyPlotBeats
        .filter((b): b is string => typeof b === 'string' && b.trim().length > 0)
        .slice(0, 4)
        .map((b) => b.trim().slice(0, 220))
    : [synopsis.slice(0, 220)];

  const streamingServices = Array.isArray(m.streamingServices)
    ? m.streamingServices
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        .slice(0, 6)
        .map((s) => s.trim().slice(0, 50))
    : [];

  const groundingSources = Array.isArray(m.groundingSources)
    ? m.groundingSources
        .filter(
          (g): g is { title: string; uri: string } =>
            Boolean(g) &&
            typeof g === 'object' &&
            typeof (g as Record<string, unknown>).title === 'string' &&
            isSafeHttpUrl((g as Record<string, unknown>).uri),
        )
        .slice(0, 5)
        .map((g) => ({
          title: g.title.trim().slice(0, 100),
          uri: g.uri,
        }))
    : [];

  return {
    id:
      typeof m.id === 'string' && m.id.trim()
        ? m.id.trim().slice(0, 60)
        : `custom-${Date.now()}`,
    title,
    year:
      typeof m.year === 'number' && m.year >= 1900 && m.year <= 2030
        ? Math.round(m.year)
        : 2020,
    director:
      typeof m.director === 'string' && m.director.trim()
        ? m.director.trim().slice(0, 80)
        : 'Featured Director',
    runtimeMinutes:
      typeof m.runtimeMinutes === 'number' &&
      m.runtimeMinutes >= 40 &&
      m.runtimeMinutes <= 300
        ? Math.round(m.runtimeMinutes)
        : 112,
    genres: Array.isArray(m.genres)
      ? m.genres
          .filter((g): g is string => typeof g === 'string' && g.trim().length > 0)
          .slice(0, 3)
          .map((g) => g.trim().slice(0, 30))
      : ['Action', 'Thriller'],
    synopsis,
    cast,
    keyPlotBeats,
    streamingServices,
    groundingSources,
    isStarter: false,
  };
}

function buildFallbackTropeTranslations(movie: MovieDossier): TropeTranslation[] {
  return movie.keyPlotBeats.slice(0, 4).map((beat, idx) => ({
    actualElement: beat,
    regencyTranslation:
      idx === 0
        ? 'An understated country prologue steeped in quiet honor.'
        : idx === 1
          ? 'A shocking breach of polite society that demands redress.'
          : idx === 2
            ? 'Our taciturn gentleman confronts arrogant metropolitan guardians.'
            : 'An unforgettable evening reckoning worthy of Jane Austen herself.',
  }));
}

function formatApiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : 'Unexpected server error.';
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      message:
        'Gemini API access was denied. Please verify your API key in Settings > Secrets.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message:
        'Gemini API quota reached. Please wait a moment or check your billing-enabled key in Settings > Secrets.',
    };
  }
  return { status: 500, message: raw };
}

async function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/catalog', (_req, res) => {
    res.json({
      starterMovies: STARTER_MOVIES,
      streamingServices: STREAMING_SERVICES,
      quizQuestions: QUIZ_QUESTIONS,
    });
  });

  app.post('/api/movies/lookup', async (req, res) => {
    const check = validateMovieQuery(req.body?.query);
    if (!check.ok) {
      return res.status(400).json({ error: check.error });
    }
    const householdServices = normalizeStreamingServices(
      req.body?.householdServices,
    );

    const exactStarter = STARTER_MOVIES.find(
      (m) => m.title.toLowerCase() === check.query.toLowerCase(),
    );
    if (exactStarter && !req.body?.forceWebLookup) {
      return res.json({ movie: exactStarter });
    }

    try {
      const movie = await lookupMovieWithGrounding(
        check.query,
        householdServices,
      );
      return res.json({ movie });
    } catch (err) {
      const formatted = formatApiError(err);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post('/api/invitations', (req, res) => {
    const presetId =
      typeof req.body?.presetId === 'string' ? req.body.presetId.trim() : undefined;
    const householdServices = normalizeStreamingServices(
      req.body?.householdServices,
    );
    const salutation = sanitizeSalutation(req.body?.salutation);

    let payload: InvitationPayload;

    if (presetId) {
      const preset = STARTER_MOVIES.find((m) => m.id === presetId);
      if (!preset) {
        return res.status(400).json({ error: 'Selected starter film was not found.' });
      }
      payload = {
        v: 1,
        presetId: preset.id,
        householdServices,
        salutation,
      };
    } else {
      const customMovie = sanitizeCustomMovie(req.body?.customMovie);
      if (!customMovie) {
        return res.status(400).json({
          error: 'Please pick a starter film or search a movie before minting an invitation.',
        });
      }
      payload = {
        v: 1,
        customMovie,
        householdServices,
        salutation,
      };
    }

    const token = encodeInvitationToken(payload);
    return res.json({
      token,
      sharePath: `/parlor/${token}`,
    });
  });

  app.get('/api/invitations/:token', (req, res) => {
    const payload = decodeInvitationToken(req.params.token);
    if (!payload) {
      return res.status(404).json({
        error:
          'This Regency invitation seal could not be verified or has expired. Ask your date-night host to mint a fresh link.',
      });
    }
    const movie = resolveMovieFromPayload(payload);
    if (!movie) {
      return res.status(404).json({
        error: 'The film referenced by this invitation could not be located.',
      });
    }

    // Strictly non-spoiler metadata — real movie title, cast, and plot are withheld until Act IV reveal.
    const meta: InvitationMeta = {
      valid: true,
      salutation: sanitizeSalutation(payload.salutation),
      householdServices: normalizeStreamingServices(payload.householdServices),
      hasPresetPoster: Boolean(movie.presetPosterPath),
    };
    return res.json(meta);
  });

  app.post('/api/parlor/pitch', async (req, res) => {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const payload = decodeInvitationToken(token);
    if (!payload) {
      return res.status(404).json({
        error: 'This invitation link is invalid or could not be decoded.',
      });
    }
    const movie = resolveMovieFromPayload(payload);
    if (!movie) {
      return res.status(404).json({ error: 'Selected film was not found.' });
    }
    const quizCheck = validateQuizAnswers(req.body?.answers);
    if (!quizCheck.ok || !quizCheck.answers) {
      return res.status(400).json({ error: quizCheck.error });
    }

    try {
      const bundle = await generateRegencyPitch(
        movie,
        quizCheck.answers,
        sanitizeSalutation(payload.salutation),
      );
      const revealNonce = saveRevealBundle({
        disguisedTitle: bundle.disguisedTitle,
        austenFidelityHeadline: bundle.austenFidelityHeadline,
        austenFidelitySummary: bundle.austenFidelitySummary,
        tropeTranslations: bundle.tropeTranslations,
        createdAt: Date.now(),
      });

      // Return ONLY disguised Regency details to preserve the surprise in Act III.
      const responseBody: DisguisedPitchResponse = {
        revealNonce,
        disguisedTitle: bundle.disguisedTitle,
        regencySubtitle: bundle.regencySubtitle,
        runtimeMinutes: movie.runtimeMinutes,
        openingParagraph: bundle.openingParagraph,
        continuationParagraph: bundle.continuationParagraph,
        dramatisPersonae: bundle.dramatisPersonae,
        posterPrompt: bundle.posterPrompt,
        presetPosterPath: movie.presetPosterPath,
      };
      return res.json(responseBody);
    } catch (err) {
      const formatted = formatApiError(err);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post('/api/parlor/poster', async (req, res) => {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const payload = decodeInvitationToken(token);
    if (!payload) {
      return res.status(404).json({ error: 'Invalid invitation token.' });
    }

    const posterPrompt =
      typeof req.body?.posterPrompt === 'string'
        ? req.body.posterPrompt.trim().slice(0, 700)
        : '';
    const disguisedTitle =
      typeof req.body?.disguisedTitle === 'string'
        ? req.body.disguisedTitle.trim().slice(0, 120)
        : 'An Evening in the Country';

    if (!posterPrompt) {
      return res.status(400).json({ error: 'Missing Regency illustration prompt.' });
    }

    try {
      const result = await generateRegencyPoster(posterPrompt, disguisedTitle);
      return res.json(result);
    } catch (err) {
      const formatted = formatApiError(err);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post('/api/parlor/reveal', (req, res) => {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const revealNonce =
      typeof req.body?.revealNonce === 'string' ? req.body.revealNonce : '';
    const fallbackDisguisedTitle =
      typeof req.body?.disguisedTitle === 'string'
        ? req.body.disguisedTitle.trim().slice(0, 120)
        : 'A Most Unexpected Evening Selection';

    const payload = decodeInvitationToken(token);
    if (!payload) {
      return res.status(404).json({ error: 'Invalid invitation token.' });
    }
    const movie = resolveMovieFromPayload(payload);
    if (!movie) {
      return res.status(404).json({ error: 'Film record not found.' });
    }

    const stored = revealNonce ? revealStore.get(revealNonce) : undefined;
    const responseBody: RevealResponse = {
      movie,
      disguisedTitle: stored?.disguisedTitle ?? fallbackDisguisedTitle,
      austenFidelityHeadline:
        stored?.austenFidelityHeadline ??
        'Technically True in Every Particular, Spiritually Pure Regency',
      austenFidelitySummary:
        stored?.austenFidelitySummary ??
        `Every broody promise in "${fallbackDisguisedTitle}" was drawn directly from ${movie.title} (${movie.year})—just dressed in linen cravats and candlelit prose.`,
      tropeTranslations:
        stored?.tropeTranslations && stored.tropeTranslations.length > 0
          ? stored.tropeTranslations
          : buildFallbackTropeTranslations(movie),
      householdServices: normalizeStreamingServices(payload.householdServices),
    };

    return res.json(responseBody);
  });

  app.post('/api/parlor/mercy-veto', async (req, res) => {
    const householdServices = normalizeStreamingServices(
      req.body?.householdServices,
    );
    const quizCheck = validateQuizAnswers(req.body?.answers);

    try {
      const grounded = await fetchMercyVetoRomances(
        householdServices,
        quizCheck.ok ? quizCheck.answers : undefined,
      );
      return res.json(grounded);
    } catch (err) {
      // If Gemini is unavailable, propagate the error clearly if API key is missing,
      // or provide curated classics only when explicitly requested as fallback.
      const formatted = formatApiError(err);
      if (req.body?.allowCuratedFallback === true) {
        return res.json({
          recommendations: matchPeriodRomancesForServices(householdServices, 3),
          groundingSources: [],
        });
      }
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  const rootDir = process.cwd();

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(rootDir, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`The Parlor Dispatch listening on http://0.0.0.0:${port}`);
  });
}

createApp();
