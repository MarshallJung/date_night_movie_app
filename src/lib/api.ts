import type {
  DisguisedPitchResponse,
  InvitationMeta,
  MercyVetoResponse,
  MovieDossier,
  QuizAnswers,
  QuizQuestion,
  RevealResponse,
  StreamingServiceId,
  StreamingServiceOption,
} from '../shared/types';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const data = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!response.ok) {
    const msg =
      typeof data.error === 'string' && data.error.trim().length > 0
        ? data.error
        : `Request failed (${response.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export interface CatalogResponse {
  starterMovies: MovieDossier[];
  streamingServices: StreamingServiceOption[];
  quizQuestions: QuizQuestion[];
}

export function fetchCatalog(): Promise<CatalogResponse> {
  return requestJson<CatalogResponse>('/api/catalog');
}

export function lookupMovie(
  query: string,
  householdServices: StreamingServiceId[],
  forceWebLookup = false,
): Promise<{ movie: MovieDossier }> {
  return requestJson<{ movie: MovieDossier }>('/api/movies/lookup', {
    method: 'POST',
    body: JSON.stringify({ query, householdServices, forceWebLookup }),
  });
}

export function createInvitation(params: {
  presetId?: string;
  customMovie?: MovieDossier;
  householdServices: StreamingServiceId[];
  salutation: string;
}): Promise<{ token: string; sharePath: string }> {
  return requestJson<{ token: string; sharePath: string }>('/api/invitations', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function fetchInvitationMeta(token: string): Promise<InvitationMeta> {
  return requestJson<InvitationMeta>(
    `/api/invitations/${encodeURIComponent(token)}`,
  );
}

export function requestRegencyPitch(
  token: string,
  answers: QuizAnswers,
): Promise<DisguisedPitchResponse> {
  return requestJson<DisguisedPitchResponse>('/api/parlor/pitch', {
    method: 'POST',
    body: JSON.stringify({ token, answers }),
  });
}

export function requestRegencyPoster(
  token: string,
  posterPrompt: string,
  disguisedTitle: string,
): Promise<{ imageDataUrl: string }> {
  return requestJson<{ imageDataUrl: string }>('/api/parlor/poster', {
    method: 'POST',
    body: JSON.stringify({ token, posterPrompt, disguisedTitle }),
  });
}

export function requestGrandReveal(params: {
  token: string;
  revealNonce: string;
  disguisedTitle: string;
}): Promise<RevealResponse> {
  return requestJson<RevealResponse>('/api/parlor/reveal', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function requestMercyVeto(params: {
  householdServices: StreamingServiceId[];
  answers?: QuizAnswers;
}): Promise<MercyVetoResponse> {
  return requestJson<MercyVetoResponse>('/api/parlor/mercy-veto', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
