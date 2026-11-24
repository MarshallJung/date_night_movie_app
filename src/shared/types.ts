export type StreamingServiceId =
  | 'prime'
  | 'netflix'
  | 'hulu'
  | 'disney'
  | 'max'
  | 'apple'
  | 'peacock'
  | 'paramount';

export interface StreamingServiceOption {
  id: StreamingServiceId;
  name: string;
}

export interface CastMember {
  actor: string;
  character: string;
  roleSummary: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MovieDossier {
  id: string;
  title: string;
  year: number;
  director: string;
  runtimeMinutes: number;
  genres: string[];
  synopsis: string;
  cast: CastMember[];
  keyPlotBeats: string[];
  streamingServices: string[];
  groundingSources: GroundingSource[];
  presetPosterPath?: string;
  isStarter?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  detail: string;
}

export interface QuizQuestion {
  id: keyof QuizAnswers;
  chapterLabel: string;
  prompt: string;
  options: QuizOption[];
}

export interface QuizAnswers {
  scandal: string;
  heroMood: string;
  setting: string;
  resolution: string;
}

export interface InvitationPayload {
  v: 1;
  presetId?: string;
  customMovie?: MovieDossier;
  householdServices: StreamingServiceId[];
  salutation: string;
}

export interface InvitationMeta {
  valid: boolean;
  salutation: string;
  householdServices: StreamingServiceId[];
  hasPresetPoster: boolean;
}

export interface DramatisPersonaeItem {
  regencyName: string;
  socialStation: string;
  description: string;
}

export interface TropeTranslation {
  actualElement: string;
  regencyTranslation: string;
}

export interface DisguisedPitchResponse {
  revealNonce: string;
  disguisedTitle: string;
  regencySubtitle: string;
  runtimeMinutes: number;
  openingParagraph: string;
  continuationParagraph: string;
  dramatisPersonae: DramatisPersonaeItem[];
  posterPrompt: string;
  presetPosterPath?: string;
}

export interface RevealResponse {
  movie: MovieDossier;
  disguisedTitle: string;
  austenFidelityHeadline: string;
  austenFidelitySummary: string;
  tropeTranslations: TropeTranslation[];
  householdServices: StreamingServiceId[];
}

export interface MercyVetoMovie {
  title: string;
  year: number;
  runtimeMinutes: number;
  synopsis: string;
  whyItFits: string;
  streamingOn: string[];
}

export interface MercyVetoResponse {
  recommendations: MercyVetoMovie[];
  groundingSources: GroundingSource[];
}
