import { ExternalLink, Film, HeartHandshake, RotateCcw } from 'lucide-react';
import { serviceIdsToNames } from '../shared/validation';
import { BotanicalWaveRule } from './RegencyFlourish';
import type { MercyVetoResponse, RevealResponse } from '../shared/types';

interface GrandRevealViewProps {
  reveal: RevealResponse;
  posterUrl: string | null;
  mercyVeto: MercyVetoResponse | null;
  mercyLoading: boolean;
  mercyError: string | null;
  onTriggerMercyVeto: () => void;
  onCreateOwn: () => void;
}

export function GrandRevealView({
  reveal,
  posterUrl,
  mercyVeto,
  mercyLoading,
  mercyError,
  onTriggerMercyVeto,
  onCreateOwn,
}: GrandRevealViewProps) {
  const { movie } = reveal;
  const householdServiceNames = serviceIdsToNames(reveal.householdServices);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-velvet text-velvet-ink">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Act IV Unmasking Header */}
        <header className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-sm font-semibold tracking-wide text-velvet-gold">
              The Curtain Rises · Tonight’s Actual Feature
            </p>
            <h1 className="mt-3 font-serif text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {movie.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-velvet-muted tabular-nums">
              <span>{movie.year}</span>
              <span aria-hidden="true">·</span>
              <span>Directed by {movie.director}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.runtimeMinutes} min</span>
              <span aria-hidden="true">·</span>
              <span>{movie.genres.join(', ')}</span>
            </p>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-velvet-muted">
              You were pitched{' '}
              <em className="font-serif text-xl text-velvet-gold">
                {reveal.disguisedTitle}
              </em>
              . Every single Regency promise was technically true—just dressed in
              cravats and candlelit prose.
            </p>

            <div className="mt-7 rounded-2xl border border-velvet-hairline bg-velvet-surface p-6">
              <h2 className="font-serif text-2xl font-bold text-velvet-gold">
                {reveal.austenFidelityHeadline}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-velvet-muted">
                {reveal.austenFidelitySummary}
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-velvet-hairline bg-velvet-surface p-5">
              {posterUrl && (
                <div className="mb-4 aspect-[4/5] max-h-72 w-full overflow-hidden rounded-xl border border-velvet-hairline">
                  <img
                    src={posterUrl}
                    alt={`Regency disguise artwork for ${reveal.disguisedTitle}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              )}
              <p className="text-xs font-semibold text-velvet-gold">
                Where to Watch
              </p>
              <p className="mt-1.5 text-sm font-medium text-white">
                {movie.streamingServices.length > 0
                  ? movie.streamingServices.join(' · ')
                  : 'Check your preferred streaming service'}
              </p>
              {householdServiceNames.length > 0 && (
                <p className="mt-2 text-xs text-velvet-muted">
                  Household services checked: {householdServiceNames.join(', ')}
                </p>
              )}

              {movie.cast.length > 0 && (
                <div className="mt-5 border-t border-velvet-hairline pt-4">
                  <p className="text-xs font-semibold text-velvet-gold">
                    Starring
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-velvet-muted">
                    {movie.cast.slice(0, 4).map((member) => (
                      <li key={`${member.actor}-${member.character}`}>
                        <span className="font-medium text-white">
                          {member.actor}
                        </span>{' '}
                        as {member.character}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {movie.groundingSources.length > 0 && (
                <div className="mt-5 border-t border-velvet-hairline pt-4">
                  <p className="text-xs font-semibold text-velvet-gold">
                    Verified Sources
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {movie.groundingSources.slice(0, 3).map((src) => (
                      <li key={src.uri}>
                        <a
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-velvet-gold underline underline-offset-2 hover:text-white"
                        >
                          <span className="truncate max-w-[230px]">
                            {src.title}
                          </span>
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </header>

        <BotanicalWaveRule className="my-12 h-5 w-full" tone="gold" />

        {/* Structural Trope Translation Open Table */}
        <section aria-labelledby="trope-table-heading">
          <div className="max-w-2xl">
            <h2
              id="trope-table-heading"
              className="font-serif text-3xl font-bold text-white sm:text-4xl"
            >
              How the Disguise Stayed Technically True
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-velvet-muted">
              Every plot beat from <strong className="text-white">{movie.title}</strong>{' '}
              mapped cleanly onto its 19th-century parlor equivalent.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-velvet-gold">
                  <th className="py-3.5 pr-6 font-semibold text-white">
                    Actual Movie Element
                  </th>
                  <th className="py-3.5 font-semibold text-velvet-gold">
                    Regency Romance Translation
                  </th>
                </tr>
              </thead>
              <tbody>
                {reveal.tropeTranslations.map((row, index) => (
                  <tr
                    key={`${row.actualElement.slice(0, 24)}-${index}`}
                    className="border-b border-velvet-hairline align-top"
                  >
                    <td className="py-4 pr-6 leading-relaxed text-velvet-muted">
                      {row.actualElement}
                    </td>
                    <td className="py-4 font-serif text-xl italic leading-snug text-white">
                      {row.regencyTranslation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Guardrail 1: Mercy Veto Escape Hatch */}
        <section
          aria-labelledby="mercy-veto-heading"
          className="mt-14 rounded-3xl border border-velvet-hairline bg-velvet-surface p-6 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2
                id="mercy-veto-heading"
                className="font-serif text-3xl font-bold text-white"
              >
                Need a Diplomatic Escape Hatch?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-velvet-muted">
                If you would genuinely prefer bonnets, mist, and yearning over
                action tonight, invoke the Mercy Veto for three authentic period
                romances matched to your household services.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onTriggerMercyVeto}
                disabled={mercyLoading}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-velvet-gold px-5 py-3 text-center text-sm font-bold text-velvet transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:whitespace-nowrap"
              >
                <HeartHandshake className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {mercyLoading
                    ? 'Finding Real Period Romances...'
                    : 'Nice try — show me an actual period romance'}
                </span>
              </button>

              <button
                type="button"
                onClick={onCreateOwn}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-velvet-hairline px-5 py-3 text-sm font-semibold text-velvet-ink transition-colors hover:border-velvet-gold hover:text-velvet-gold whitespace-nowrap"
              >
                <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
                Disguise Another Film
              </button>
            </div>
          </div>

          {mercyError && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-velvet-gold/40 bg-velvet px-4 py-3 text-sm text-velvet-gold"
            >
              {mercyError}
            </p>
          )}

          {mercyVeto && mercyVeto.recommendations.length > 0 && (
            <div className="mt-8 border-t border-velvet-hairline pt-7">
              <p className="text-xs font-semibold tracking-wide text-velvet-gold">
                Genuine Period Romances · Zero Secret Action Heroes
              </p>

              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
                {mercyVeto.recommendations.map((rec) => (
                  <div
                    key={`${rec.title}-${rec.year}`}
                    className="flex flex-col justify-between border-t-2 border-velvet-gold pt-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-velvet-muted tabular-nums">
                        <Film className="h-3.5 w-3.5 text-velvet-gold" aria-hidden="true" />
                        <span>{rec.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rec.runtimeMinutes} min</span>
                      </div>
                      <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                        {rec.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-velvet-muted">
                        {rec.synopsis}
                      </p>
                      <p className="mt-3 font-serif text-base italic text-velvet-gold">
                        “{rec.whyItFits}”
                      </p>
                    </div>
                    <p className="mt-4 border-t border-velvet-hairline pt-3 text-xs font-medium text-white">
                      Watch on: {rec.streamingOn.join(' · ')}
                    </p>
                  </div>
                ))}
              </div>

              {mercyVeto.groundingSources.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-velvet-hairline pt-4 text-xs text-velvet-muted">
                  <span>Streaming sources:</span>
                  {mercyVeto.groundingSources.slice(0, 4).map((src) => (
                    <a
                      key={src.uri}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-velvet-gold underline underline-offset-2 hover:text-white"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
