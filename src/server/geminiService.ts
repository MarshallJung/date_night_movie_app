import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { QUIZ_QUESTIONS } from '../shared/catalog.ts';
import {
  extractJsonObject,
  isSafeHttpUrl,
  serviceIdsToNames,
} from '../shared/validation.ts';
import type {
  DramatisPersonaeItem,
  GroundingSource,
  MercyVetoMovie,
  MercyVetoResponse,
  MovieDossier,
  QuizAnswers,
  StreamingServiceId,
  TropeTranslation,
} from '../shared/types.ts';

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      'Gemini API key is not configured on the server. Please check Settings > Secrets.',
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractGroundingSources(
  response: Awaited<
    ReturnType<GoogleGenAI['models']['generateContent']>
  >,
): GroundingSource[] {
  const chunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const sources: GroundingSource[] = [];
  for (const chunk of chunks) {
    const uri = chunk.web?.uri;
    const title = chunk.web?.title;
    if (uri && isSafeHttpUrl(uri) && !seen.has(uri)) {
      seen.add(uri);
      sources.push({
        title: (title || new URL(uri).hostname).slice(0, 120),
        uri,
      });
    }
  }
  return sources.slice(0, 6);
}

function describeQuizChoices(answers: QuizAnswers): string {
  const lines: string[] = [];
  for (const q of QUIZ_QUESTIONS) {
    const selectedId = answers[q.id];
    const match = q.options.find((opt) => opt.id === selectedId);
    const valueText = match
      ? `${match.label} (${match.detail})`
      : selectedId;
    lines.push(`- ${q.prompt} -> ${valueText}`);
  }
  return lines.join('\n');
}

interface RawMovieLookup {
  title?: string;
  year?: number;
  director?: string;
  runtimeMinutes?: number;
  genres?: string[];
  synopsis?: string;
  cast?: Array<{ actor?: string; character?: string; roleSummary?: string }>;
  keyPlotBeats?: string[];
  streamingServices?: string[];
}

export async function lookupMovieWithGrounding(
  query: string,
  householdServices: StreamingServiceId[],
): Promise<MovieDossier> {
  const ai = getClient();
  const preferredServices = serviceIdsToNames(householdServices).join(', ');

  const prompt = [
    `Find accurate, verified real-world metadata for the feature film "${query}".`,
    `Also check where it is currently streaming, rentable, or available in the United States (noting especially whether it appears on any of: ${preferredServices}).`,
    `Return ONLY a single JSON object inside a \`\`\`json code block with these exact fields:`,
    `{`,
    `  "title": "Official release title",`,
    `  "year": 2024,`,
    `  "director": "Director name",`,
    `  "runtimeMinutes": 110,`,
    `  "genres": ["Action", "Thriller"],`,
    `  "synopsis": "Concise 2-3 sentence factual plot summary naming key protagonists, antagonists, and setting.",`,
    `  "cast": [`,
    `    { "actor": "Actor Name", "character": "Character Name", "roleSummary": "One-sentence factual role description" }`,
    `  ],`,
    `  "keyPlotBeats": ["4 chronological factual plot beats including the setup, inciting wrong, rising conflict, and climax"],`,
    `  "streamingServices": ["List of US streaming or major rental platforms where the film is currently available"]`,
    `}`,
    `Provide 3 to 5 top-billed cast members with accurate character names. Do not invent characters or plot points.`,
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });

  const rawText = response.text ?? '';
  const parsed = extractJsonObject<RawMovieLookup>(rawText);
  if (!parsed || !parsed.title || !parsed.synopsis) {
    throw new Error(
      `Could not verify structured movie details for "${query}". Try including the release year (for example, "Heat 1995").`,
    );
  }

  const groundingSources = extractGroundingSources(response);
  const cast = Array.isArray(parsed.cast)
    ? parsed.cast
        .filter((c) => c && typeof c.actor === 'string' && typeof c.character === 'string')
        .slice(0, 5)
        .map((c) => ({
          actor: String(c.actor).trim(),
          character: String(c.character).trim(),
          roleSummary:
            typeof c.roleSummary === 'string' && c.roleSummary.trim()
              ? c.roleSummary.trim()
              : 'Key figure in the narrative.',
        }))
    : [];

  const keyPlotBeats = Array.isArray(parsed.keyPlotBeats)
    ? parsed.keyPlotBeats
        .filter((b): b is string => typeof b === 'string' && b.trim().length > 0)
        .slice(0, 4)
    : [parsed.synopsis];

  const streamingServices = Array.isArray(parsed.streamingServices)
    ? parsed.streamingServices
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        .slice(0, 6)
    : [];

  const slug = parsed.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);

  return {
    id: `custom-${slug || 'film'}-${Number(parsed.year) || 2000}`,
    title: parsed.title.trim(),
    year:
      typeof parsed.year === 'number' && parsed.year >= 1900 && parsed.year <= 2030
        ? Math.round(parsed.year)
        : 2020,
    director:
      typeof parsed.director === 'string' && parsed.director.trim()
        ? parsed.director.trim()
        : 'Featured Director',
    runtimeMinutes:
      typeof parsed.runtimeMinutes === 'number' &&
      parsed.runtimeMinutes >= 40 &&
      parsed.runtimeMinutes <= 300
        ? Math.round(parsed.runtimeMinutes)
        : 112,
    genres:
      Array.isArray(parsed.genres) && parsed.genres.length > 0
        ? parsed.genres.filter((g): g is string => typeof g === 'string').slice(0, 3)
        : ['Action', 'Thriller'],
    synopsis: parsed.synopsis.trim(),
    cast,
    keyPlotBeats,
    streamingServices:
      streamingServices.length > 0
        ? streamingServices
        : ['Digital Rental / Streaming Check'],
    groundingSources,
    isStarter: false,
  };
}

export interface GeneratedRegencyBundle {
  disguisedTitle: string;
  regencySubtitle: string;
  openingParagraph: string;
  continuationParagraph: string;
  dramatisPersonae: DramatisPersonaeItem[];
  posterPrompt: string;
  austenFidelityHeadline: string;
  austenFidelitySummary: string;
  tropeTranslations: TropeTranslation[];
}

export async function generateRegencyPitch(
  movie: MovieDossier,
  quizAnswers: QuizAnswers,
  salutation: string,
): Promise<GeneratedRegencyBundle> {
  const ai = getClient();

  const systemInstruction = [
    'You are a literary curator writing in the lush, earnest, witty voice of Jane Austen for "The Parlor Dispatch", an evening period-romance cinema salon.',
    'Your task is STRUCTURAL TROPE MAPPING: take the REAL, verified plot, characters, and climax of a modern action/thriller movie and faithfully translate every element into 19th-century Regency social equivalents so that EVERY SINGLE STATEMENT REMAINS TECHNICALLY TRUE while reading like a genuine lost Jane Austen adaptation.',
    'STRICT DISGUISE RULES FOR THE PITCH FIELDS (disguisedTitle, regencySubtitle, openingParagraph, continuationParagraph, dramatisPersonae, posterPrompt):',
    '- NEVER mention the real movie title, real actor names, guns, bombs, explosions, bullets, cars, jets, computers, CIA/FBI, phishing, or modern action words.',
    '- Translate real character names into Regency equivalents (e.g., "Adam Clay" -> "Mr. Adam Clay", "Derek Danforth" -> "Young Lord Danforth", "Eloise Parker" -> "Mrs. Eloise Parker").',
    '- Weave the recipient’s exact 4 parlor quiz preferences naturally into the pitch so she feels the selection was lovingly tailored to her tastes.',
    '- Keep openingParagraph around 65-85 words and continuationParagraph around 65-85 words.',
    '- For posterPrompt: write a detailed visual art prompt for a classical 19th-century Regency period-drama oil painting (no text, no words, no modern weapons or vehicles; strictly Regency attire, manor estates, mist, candlelight, golden hour, painterly brushstrokes inspired by Constable/Turner).',
    '- For tropeTranslations (shown ONLY AFTER the reveal): list 4 sharp, hilarious side-by-side pairs where actualElement states the real grounded plot/character fact from the movie and regencyTranslation shows its technically-true Regency translation.',
    '- For austenFidelityHeadline & austenFidelitySummary (shown ONLY AFTER the reveal): craft a witty, playful theatrical verdict celebrating how absurdly well the action plot maps onto Austen tropes.',
  ].join('\n');

  const movieFacts = [
    `REAL MOVIE TITLE: ${movie.title} (${movie.year}), directed by ${movie.director}`,
    `RUNTIME: ${movie.runtimeMinutes} minutes | GENRES: ${movie.genres.join(', ')}`,
    `VERIFIED SYNOPSIS: ${movie.synopsis}`,
    `VERIFIED CAST & CHARACTERS:`,
    ...movie.cast.map(
      (c) => `- ${c.character} (played by ${c.actor}): ${c.roleSummary}`,
    ),
    `VERIFIED PLOT BEATS:`,
    ...movie.keyPlotBeats.map((b, i) => `${i + 1}. ${b}`),
    ``,
    `RECIPIENT SALUTATION: ${salutation}`,
    `HER PARLOR QUIZ SELECTIONS:`,
    describeQuizChoices(quizAnswers),
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: movieFacts,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          disguisedTitle: {
            type: Type.STRING,
            description:
              'A charming Jane Austen-style disguised working title (e.g., "Pride, Prejudice & the Apiary"). Never include the real title.',
          },
          regencySubtitle: {
            type: Type.STRING,
            description:
              'A short 6-12 word Regency literary subtitle evoking romance and intrigue.',
          },
          openingParagraph: {
            type: Type.STRING,
            description:
              'First lush Austen-voiced pitch paragraph addressing her salutation and weaving her quiz preferences.',
          },
          continuationParagraph: {
            type: Type.STRING,
            description:
              'Second earnest paragraph describing the central social reckoning and emotional stakes without any modern action terminology.',
          },
          dramatisPersonae: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                regencyName: { type: Type.STRING },
                socialStation: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['regencyName', 'socialStation', 'description'],
            },
            description: '3 to 4 key characters translated into Regency society equivalents.',
          },
          posterPrompt: {
            type: Type.STRING,
            description:
              'Oil painting art direction prompt for a 19th-century Regency period drama poster matching the disguised title. No text, no modern objects.',
          },
          austenFidelityHeadline: {
            type: Type.STRING,
            description:
              'Witty post-reveal verdict headline (e.g., "Technically 100% Accurate, Spiritually 99% Austen").',
          },
          austenFidelitySummary: {
            type: Type.STRING,
            description:
              'Two playful sentences shown on the reveal screen explaining why this action thriller secretly follows Jane Austen structure.',
          },
          tropeTranslations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                actualElement: { type: Type.STRING },
                regencyTranslation: { type: Type.STRING },
              },
              required: ['actualElement', 'regencyTranslation'],
            },
            description: '4 exact movie plot/character facts mapped to their Regency disguise.',
          },
        },
        required: [
          'disguisedTitle',
          'regencySubtitle',
          'openingParagraph',
          'continuationParagraph',
          'dramatisPersonae',
          'posterPrompt',
          'austenFidelityHeadline',
          'austenFidelitySummary',
          'tropeTranslations',
        ],
      },
    },
  });

  const jsonText = (response.text ?? '').trim();
  const parsed = JSON.parse(jsonText) as GeneratedRegencyBundle;

  return {
    disguisedTitle: parsed.disguisedTitle,
    regencySubtitle: parsed.regencySubtitle,
    openingParagraph: parsed.openingParagraph,
    continuationParagraph: parsed.continuationParagraph,
    dramatisPersonae: (parsed.dramatisPersonae ?? []).slice(0, 4),
    posterPrompt: parsed.posterPrompt,
    austenFidelityHeadline: parsed.austenFidelityHeadline,
    austenFidelitySummary: parsed.austenFidelitySummary,
    tropeTranslations: (parsed.tropeTranslations ?? []).slice(0, 4),
  };
}

export async function generateRegencyPoster(
  posterPrompt: string,
  disguisedTitle: string,
): Promise<{ imageDataUrl: string }> {
  const ai = getClient();

  const fullPrompt = [
    `Classical 19th-century Regency period drama oil painting poster illustration inspired by "${disguisedTitle}".`,
    posterPrompt,
    'Masterpiece period cinema aesthetic, warm painterly oil brushstrokes, atmospheric English countryside or Georgian candlelit manor, strictly 19th-century attire, no text, no letters, no typography, no watermarks, no modern weapons or vehicles.',
  ].join(' ');

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-image',
    contents: {
      parts: [{ text: fullPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: '3:4',
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType ?? 'image/png';
      return {
        imageDataUrl: `data:${mime};base64,${part.inlineData.data}`,
      };
    }
  }

  throw new Error('The Regency portrait studio did not return an image. Please try again.');
}

interface RawMercyVetoPayload {
  recommendations?: Array<{
    title?: string;
    year?: number;
    runtimeMinutes?: number;
    synopsis?: string;
    whyItFits?: string;
    streamingOn?: string[];
  }>;
}

export async function fetchMercyVetoRomances(
  householdServices: StreamingServiceId[],
  quizAnswers?: QuizAnswers,
): Promise<MercyVetoResponse> {
  const ai = getClient();
  const serviceList = serviceIdsToNames(householdServices).join(', ');
  const quizContext = quizAnswers
    ? `Her quiz answers were:\n${describeQuizChoices(quizAnswers)}`
    : 'She loves sweeping Regency or 19th-century period romances with wit and brooding heroes.';

  const prompt = [
    `Recommend 3 GENUINE, beloved period romance / costume drama films (e.g. Jane Austen adaptations, Brontë dramas, or lush 19th-century literary romances—ZERO action movies!) that are currently available to stream or rent in the US, prioritizing these household services: ${serviceList}.`,
    quizContext,
    `Return ONLY a single JSON object inside a \`\`\`json code block:`,
    `{`,
    `  "recommendations": [`,
    `    {`,
    `      "title": "Exact Movie Title",`,
    `      "year": 2005,`,
    `      "runtimeMinutes": 129,`,
    `      "synopsis": "Concise 2-sentence factual synopsis.",`,
    `      "whyItFits": "One warm sentence connecting this genuine costume drama to her quiz mood.",`,
    `      "streamingOn": ["Platform Name"]`,
    `    }`,
    `  ]`,
    `}`,
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });

  const parsed = extractJsonObject<RawMercyVetoPayload>(response.text ?? '');
  const groundingSources = extractGroundingSources(response);

  if (!parsed || !Array.isArray(parsed.recommendations) || parsed.recommendations.length === 0) {
    throw new Error('Could not retrieve grounded period romance recommendations right now.');
  }

  const recommendations: MercyVetoMovie[] = parsed.recommendations
    .filter((r) => r && typeof r.title === 'string' && typeof r.synopsis === 'string')
    .slice(0, 3)
    .map((r) => ({
      title: String(r.title).trim(),
      year: typeof r.year === 'number' ? Math.round(r.year) : 2005,
      runtimeMinutes:
        typeof r.runtimeMinutes === 'number' ? Math.round(r.runtimeMinutes) : 120,
      synopsis: String(r.synopsis).trim(),
      whyItFits:
        typeof r.whyItFits === 'string' && r.whyItFits.trim()
          ? r.whyItFits.trim()
          : 'A genuine, swooning costume drama with zero surprise stunts.',
      streamingOn:
        Array.isArray(r.streamingOn) && r.streamingOn.length > 0
          ? r.streamingOn.filter((s): s is string => typeof s === 'string').slice(0, 4)
          : serviceIdsToNames(householdServices).slice(0, 2),
    }));

  if (recommendations.length === 0) {
    throw new Error('No period romance recommendations were returned.');
  }

  return { recommendations, groundingSources };
}
