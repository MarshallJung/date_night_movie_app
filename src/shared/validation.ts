import { CURATED_PERIOD_ROMANCES, STREAMING_SERVICES } from './catalog';
import type {
  MercyVetoMovie,
  QuizAnswers,
  StreamingServiceId,
} from './types';

const VALID_SERVICE_IDS = new Set<string>(STREAMING_SERVICES.map((s) => s.id));

export function sanitizeSalutation(raw: unknown): string {
  if (typeof raw !== 'string') {
    return 'Dearest';
  }
  const cleaned = raw.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 40);
  return cleaned.length > 0 ? cleaned : 'Dearest';
}

export function validateMovieQuery(raw: unknown): {
  ok: boolean;
  query: string;
  error?: string;
} {
  if (typeof raw !== 'string') {
    return { ok: false, query: '', error: 'Please enter a movie title to look up.' };
  }
  const trimmed = raw.replace(/\s+/g, ' ').trim();
  if (trimmed.length < 2) {
    return {
      ok: false,
      query: '',
      error: 'Please enter at least 2 characters for a movie title.',
    };
  }
  if (trimmed.length > 100) {
    return {
      ok: false,
      query: '',
      error: 'Movie titles must be 100 characters or fewer.',
    };
  }
  return { ok: true, query: trimmed };
}

export function normalizeStreamingServices(
  raw: unknown,
): StreamingServiceId[] {
  if (!Array.isArray(raw)) {
    return ['prime', 'netflix'];
  }
  const unique: StreamingServiceId[] = [];
  for (const item of raw) {
    if (
      typeof item === 'string' &&
      VALID_SERVICE_IDS.has(item) &&
      !unique.includes(item as StreamingServiceId)
    ) {
      unique.push(item as StreamingServiceId);
    }
  }
  return unique.length > 0 ? unique : ['prime'];
}

export function isSafeHttpUrl(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateQuizAnswers(raw: unknown): {
  ok: boolean;
  answers?: QuizAnswers;
  error?: string;
} {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Please answer all four parlor questions.' };
  }
  const candidate = raw as Record<string, unknown>;
  const keys: (keyof QuizAnswers)[] = [
    'scandal',
    'heroMood',
    'setting',
    'resolution',
  ];
  const result = {} as QuizAnswers;
  for (const key of keys) {
    const val = candidate[key];
    if (typeof val !== 'string' || val.trim().length === 0 || val.length > 120) {
      return {
        ok: false,
        error: 'Each parlor question requires a valid selection.',
      };
    }
    result[key] = val.trim();
  }
  return { ok: true, answers: result };
}

export function isTokenSpoilerFree(token: string, movieTitle: string): boolean {
  const lowerToken = token.toLowerCase();
  const significantWords = movieTitle
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4);
  return significantWords.every((word) => !lowerToken.includes(word));
}

export function extractJsonObject<T>(rawText: string): T | null {
  if (!rawText || typeof rawText !== 'string') return null;
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fencedMatch ? fencedMatch[1] : rawText).trim();
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }
  try {
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1)) as T;
  } catch {
    return null;
  }
}

export function serviceIdsToNames(ids: StreamingServiceId[]): string[] {
  const map = new Map(STREAMING_SERVICES.map((s) => [s.id, s.name]));
  return ids.map((id) => map.get(id)).filter((v): v is string => Boolean(v));
}

export function matchPeriodRomancesForServices(
  householdServices: StreamingServiceId[],
  limit = 3,
): MercyVetoMovie[] {
  const desiredNames = new Set(
    serviceIdsToNames(householdServices).map((n) => n.toLowerCase()),
  );
  const scored = CURATED_PERIOD_ROMANCES.map((movie) => {
    const matches = movie.streamingOn.filter((s) =>
      desiredNames.has(s.toLowerCase()),
    ).length;
    return { movie, matches };
  });
  scored.sort((a, b) => b.matches - a.matches);
  return scored.slice(0, limit).map((item) => item.movie);
}
