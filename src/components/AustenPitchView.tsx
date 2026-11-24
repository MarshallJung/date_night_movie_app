import { useState } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { BeeEmblem, BotanicalWaveRule } from './RegencyFlourish';
import type { DisguisedPitchResponse } from '../shared/types';

interface AustenPitchViewProps {
  salutation: string;
  pitch: DisguisedPitchResponse;
  posterUrl: string | null;
  posterLoading: boolean;
  posterError: string | null;
  revealing: boolean;
  onRegeneratePoster: () => void;
  onAcceptSelection: () => void;
  onRetakeQuiz: () => void;
}

export function AustenPitchView({
  salutation,
  pitch,
  posterUrl,
  posterLoading,
  posterError,
  revealing,
  onRegeneratePoster,
  onAcceptSelection,
  onRetakeQuiz,
}: AustenPitchViewProps) {
  const [imageBroken, setImageBroken] = useState(false);

  const showPosterImage = Boolean(posterUrl) && !imageBroken;

  return (
    <article
      aria-labelledby="disguised-title-heading"
      className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: 3:4 Bespoke Regency Disguise Poster */}
        <figure className="lg:col-span-5">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-hairline bg-paper-elevated shadow-sm">
            {showPosterImage ? (
              <img
                src={posterUrl ?? ''}
                alt={`Regency period-drama illustration for ${pitch.disguisedTitle}`}
                referrerPolicy="no-referrer"
                onError={() => setImageBroken(true)}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-paper-elevated via-paper to-hairline/40 p-8 text-center">
                <BeeEmblem className="h-10 w-10" />
                <p className="mt-4 font-serif text-2xl font-bold text-ink">
                  {pitch.disguisedTitle}
                </p>
                <p className="mt-2 max-w-xs text-sm text-ink-muted">
                  {posterLoading
                    ? 'Painting your bespoke Regency period-drama portrait...'
                    : 'Illustrated circulating-library edition'}
                </p>
                {posterLoading && (
                  <div
                    aria-live="polite"
                    className="mt-5 h-1.5 w-36 overflow-hidden rounded-full bg-hairline"
                  >
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-plum" />
                  </div>
                )}
              </div>
            )}

            {/* Measured bottom editorial title overlay on poster */}
            {showPosterImage && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent px-6 pb-6 pt-16 text-white">
                <p className="text-xs font-medium tracking-wider text-velvet-gold">
                  An Evening Selection
                </p>
                <p className="mt-1 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {pitch.disguisedTitle}
                </p>
              </div>
            )}
          </div>

          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
            <span>
              Fig. 1 — Bespoke period-drama plate prepared for {salutation}
            </span>
            <button
              type="button"
              onClick={() => {
                setImageBroken(false);
                onRegeneratePoster();
              }}
              disabled={posterLoading}
              className="inline-flex min-h-[36px] items-center gap-1.5 font-semibold text-plum-dark transition-colors hover:text-sage-dark disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${posterLoading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              {posterLoading ? 'Painting...' : 'Paint Fresh Portrait'}
            </button>
          </figcaption>

          {posterError && (
            <p
              role="alert"
              className="mt-2 text-xs font-medium text-plum-dark"
            >
              {posterError}
            </p>
          )}
        </figure>

        {/* Right Column: Editorial Broadsheet Pitch */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
            <span className="font-semibold text-sage-dark">
              Evening Recommendation
            </span>
            <span aria-hidden="true">·</span>
            <span>Period Drama</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{pitch.runtimeMinutes} min</span>
          </div>

          <h1
            id="disguised-title-heading"
            className="mt-2.5 font-serif text-4xl font-bold leading-[1.03] tracking-tight text-ink sm:text-5xl"
          >
            {pitch.disguisedTitle}
          </h1>

          <p className="mt-2 font-serif text-xl italic text-plum-dark sm:text-2xl">
            {pitch.regencySubtitle}
          </p>

          <BotanicalWaveRule className="my-5 h-5 w-full" tone="sage" />

          <div className="max-w-prose space-y-4 text-[15.5px] leading-[1.7] text-ink-body">
            <p className="regency-dropcap">{pitch.openingParagraph}</p>
            <p>{pitch.continuationParagraph}</p>
          </div>

          {/* Primary Reveal CTA immediately below pitch prose */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5 border-t border-hairline pt-6">
            <button
              type="button"
              onClick={onAcceptSelection}
              disabled={revealing}
              className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-plum px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-plum-dark disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              {revealing
                ? 'Drawing Back the Curtain...'
                : 'Yes, this sounds delightful!'}
            </button>

            <button
              type="button"
              onClick={onRetakeQuiz}
              disabled={revealing}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-hairline bg-paper-elevated px-4 py-2.5 text-sm font-semibold text-ink-body transition-colors hover:border-ink/40 hover:text-ink whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Retake Quiz
            </button>
          </div>

          {/* Dramatis Personae */}
          {pitch.dramatisPersonae.length > 0 && (
            <section
              aria-labelledby="dramatis-personae-heading"
              className="mt-9 border-t border-hairline pt-6"
            >
              <h2
                id="dramatis-personae-heading"
                className="font-serif text-2xl font-bold text-ink"
              >
                Dramatis Personae
              </h2>
              <dl className="mt-3 divide-y divide-hairline">
                {pitch.dramatisPersonae.map((person) => (
                  <div
                    key={person.regencyName}
                    className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-12 sm:gap-4"
                  >
                    <dt className="sm:col-span-5">
                      <span className="block font-serif text-xl font-bold text-ink">
                        {person.regencyName}
                      </span>
                      <span className="block text-xs font-medium text-sage-dark">
                        {person.socialStation}
                      </span>
                    </dt>
                    <dd className="text-sm leading-relaxed text-ink-body sm:col-span-7">
                      {person.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
