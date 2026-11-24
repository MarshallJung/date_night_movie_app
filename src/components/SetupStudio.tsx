import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Link2,
  Search,
} from 'lucide-react';
import {
  HERO_EDITORIAL_IMAGE,
  STARTER_MOVIES,
  STREAMING_SERVICES,
} from '../shared/catalog';
import { createInvitation, lookupMovie } from '../lib/api';
import { validateMovieQuery } from '../shared/validation';
import { BeeEmblem, BotanicalWaveRule } from './RegencyFlourish';
import type { MovieDossier, StreamingServiceId } from '../shared/types';

interface SetupStudioProps {
  onLaunchParlor: (token: string) => void;
}

export function SetupStudio({ onLaunchParlor }: SetupStudioProps) {
  const [selectedMovie, setSelectedMovie] = useState<MovieDossier>(
    STARTER_MOVIES[0],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [householdServices, setHouseholdServices] = useState<
    StreamingServiceId[]
  >(['prime', 'netflix', 'hulu']);
  const [salutation, setSalutation] = useState('Dearest');

  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintedInvite, setMintedInvite] = useState<{
    token: string;
    sharePath: string;
    movieTitle: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [heroImageBroken, setHeroImageBroken] = useState(false);

  function toggleService(id: StreamingServiceId) {
    setHouseholdServices((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    setMintedInvite(null);
  }

  function handleSelectStarter(movie: MovieDossier) {
    setSelectedMovie(movie);
    setSearchError(null);
    setMintError(null);
    setMintedInvite(null);
  }

  async function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const check = validateMovieQuery(searchQuery);
    if (!check.ok) {
      setSearchError(check.error ?? 'Please enter a valid movie title.');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setMintedInvite(null);
    try {
      const { movie } = await lookupMovie(check.query, householdServices, true);
      setSelectedMovie(movie);
    } catch (err: unknown) {
      setSearchError(
        err instanceof Error
          ? err.message
          : 'Could not look up that film right now. Please try again.',
      );
    } finally {
      setSearchLoading(false);
    }
  }

  async function mintInviteForMovie(
    movie: MovieDossier,
  ): Promise<{ token: string; sharePath: string } | null> {
    setMinting(true);
    setMintError(null);
    try {
      const result = await createInvitation({
        presetId: movie.isStarter ? movie.id : undefined,
        customMovie: movie.isStarter ? undefined : movie,
        householdServices,
        salutation,
      });
      setMintedInvite({
        token: result.token,
        sharePath: result.sharePath,
        movieTitle: movie.title,
      });
      setCopied(false);
      return result;
    } catch (err: unknown) {
      setMintError(
        err instanceof Error
          ? err.message
          : 'Unable to mint covert invitation link.',
      );
      return null;
    } finally {
      setMinting(false);
    }
  }

  async function handleQuickPreview() {
    if (mintedInvite && mintedInvite.movieTitle === selectedMovie.title) {
      onLaunchParlor(mintedInvite.token);
      return;
    }
    const created = await mintInviteForMovie(selectedMovie);
    if (created) {
      onLaunchParlor(created.token);
    }
  }

  async function handleCopyLink() {
    if (!mintedInvite) return;
    const fullUrl = `${window.location.origin}${mintedInvite.sharePath}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  const shareUrlDisplay = mintedInvite
    ? `${window.location.origin}${mintedInvite.sharePath}`
    : '';

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
          <a
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-ink whitespace-nowrap shrink-0"
          >
            The Parlor Dispatch
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 text-sm font-medium text-ink-body md:flex"
          >
            <a
              href="#setup-studio"
              className="transition-colors hover:text-plum-dark whitespace-nowrap shrink-0"
            >
              Setup
            </a>
            <a
              href="#starter-vault"
              className="transition-colors hover:text-plum-dark whitespace-nowrap shrink-0"
            >
              Starter Vault
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-plum-dark whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
          </nav>

          <button
            type="button"
            onClick={() => void handleQuickPreview()}
            disabled={minting}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-plum px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-plum-dark disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            {minting ? 'Preparing...' : 'Preview Quiz'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        {/* Asymmetric Editorial Hero */}
        <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-plum-dark">
                <BeeEmblem className="h-6 w-6 shrink-0" />
                <span className="font-serif text-lg italic">
                  A Truth Universally Acknowledged About Date Night
                </span>
              </div>

              <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.98] tracking-tight text-ink sm:text-6xl">
                Turn Any <em className="italic text-plum-dark">Action Thriller</em>{' '}
                Into a Jane Austen Romance
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-body sm:text-lg">
                Secretly pick tonight’s movie, mint a spoiler-free parlor link,
                and watch an earnest Regency quiz, Austen pitch, and bespoke oil
                painting unfold—right up until the velvet curtain rises.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-hairline pt-5 text-sm text-ink-muted">
              <span>Zero external API keys</span>
              <span aria-hidden="true">·</span>
              <span>Encrypted spoiler-free link</span>
              <span aria-hidden="true">·</span>
              <span>Mercy Veto escape hatch</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full min-h-[240px] overflow-hidden rounded-3xl border border-hairline bg-paper-elevated">
              {!heroImageBroken ? (
                <img
                  src={HERO_EDITORIAL_IMAGE}
                  alt="Wax-sealed Regency invitation with a golden bee emblem, porcelain teacup, botanical sage, and opera glasses on lavender-blush linen"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImageBroken(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[240px] flex-col items-center justify-center p-8 text-center">
                  <BeeEmblem className="h-10 w-10" />
                  <p className="mt-3 font-serif text-2xl font-bold text-ink">
                    The Parlor Dispatch
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <BotanicalWaveRule className="my-12 h-5 w-full" tone="sage" />

        {/* Act I: Secret Setup Studio Workspace */}
        <section
          id="setup-studio"
          aria-labelledby="setup-heading"
          className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12"
        >
          {/* Left 7 Columns: Search, Starter Vault, Household Services, Salutation */}
          <div className="space-y-10 lg:col-span-7">
            <div>
              <p className="text-xs font-semibold text-sage-dark">
                Act I · Secret Host Studio
              </p>
              <h2
                id="setup-heading"
                className="mt-1.5 font-serif text-3xl font-bold text-ink sm:text-4xl"
              >
                Choose Tonight’s Disguised Feature
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Search any film using live Google Search grounding, or pick a
                ready-to-test classic from the Starter Vault below.
              </p>

              {/* Search Any Movie Form */}
              <form
                onSubmit={(e) => void handleSearchSubmit(e)}
                className="mt-5 flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <label htmlFor="movie-search-input" className="sr-only">
                    Search any movie title
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="movie-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (searchError) setSearchError(null);
                    }}
                    placeholder="Try any movie — e.g. Mission: Impossible, Speed, Heat..."
                    className="min-h-[46px] w-full rounded-xl border border-hairline bg-paper-elevated py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-plum focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-plum-dark disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  {searchLoading ? 'Looking Up...' : 'Look Up Film'}
                </button>
              </form>

              {searchError && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl border border-plum/30 bg-plum/5 px-4 py-2.5 text-sm font-medium text-plum-dark"
                >
                  {searchError}
                </p>
              )}
            </div>

            {/* Starter Vault */}
            <div id="starter-vault" className="border-t border-hairline pt-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  Starter Action Vault
                </h3>
                <span className="text-xs text-ink-muted">
                  Instant grounded plots &amp; Regency plates
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {STARTER_MOVIES.map((movie) => {
                  const isActive = selectedMovie.id === movie.id;
                  return (
                    <button
                      key={movie.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleSelectStarter(movie)}
                      className={`flex min-h-[78px] flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-150 ${
                        isActive
                          ? 'border-plum bg-paper-elevated shadow-sm ring-1 ring-plum/20'
                          : 'border-hairline bg-paper-elevated/60 hover:border-plum/45 hover:bg-paper-elevated'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-xl font-bold leading-snug text-ink">
                          {movie.title}
                        </span>
                        <span className="text-xs font-semibold text-ink-muted tabular-nums shrink-0">
                          {movie.year}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-ink-muted">
                        {movie.cast[0]?.actor ?? movie.director}
                        <span aria-hidden="true" className="mx-1.5">
                          ·
                        </span>
                        {movie.streamingServices.slice(0, 2).join(', ')}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Household Streaming Services */}
            <div className="border-t border-hairline pt-8">
              <h3 className="font-serif text-2xl font-bold text-ink">
                Your Household Streaming Services
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Used to check watch options and tailor the Mercy Veto period
                romance escape hatch.
              </p>

              <div
                role="group"
                aria-label="Household streaming services"
                className="mt-4 flex flex-wrap gap-2.5"
              >
                {STREAMING_SERVICES.map((service) => {
                  const selected = householdServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleService(service.id)}
                      className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                        selected
                          ? 'border-sage bg-sage text-white'
                          : 'border-hairline bg-paper-elevated text-ink-body hover:border-sage/50 hover:text-ink'
                      }`}
                    >
                      {selected && (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {service.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Salutation Customization */}
            <div className="border-t border-hairline pt-8">
              <label
                htmlFor="salutation-input"
                className="block font-serif text-2xl font-bold text-ink"
              >
                Recipient Salutation
              </label>
              <p className="mt-1 text-sm text-ink-muted">
                How the Regency quiz and pitch should address your date (keep
                inputs lighthearted).
              </p>
              <input
                id="salutation-input"
                type="text"
                maxLength={40}
                value={salutation}
                onChange={(e) => {
                  setSalutation(e.target.value);
                  setMintedInvite(null);
                }}
                placeholder="Dearest"
                className="mt-3 min-h-[46px] w-full max-w-sm rounded-xl border border-hairline bg-paper-elevated px-4 py-2.5 text-sm text-ink focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          {/* Right 5 Columns: Grounded Dossier Preview & Covert Link Minter */}
          <aside className="lg:sticky lg:top-24 lg:col-span-5">
            <div className="rounded-3xl border border-hairline bg-paper-elevated p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold text-sage-dark">
                <span>Grounded Film Dossier</span>
                <span className="tabular-nums text-ink-muted">
                  {selectedMovie.year} · {selectedMovie.runtimeMinutes} min
                </span>
              </div>

              <h3 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink">
                {selectedMovie.title}
              </h3>

              <p className="mt-1 text-xs text-ink-muted">
                Directed by {selectedMovie.director}
                <span aria-hidden="true" className="mx-1.5">
                  ·
                </span>
                {selectedMovie.genres.join(', ')}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-ink-body">
                {selectedMovie.synopsis}
              </p>

              {selectedMovie.cast.length > 0 && (
                <div className="mt-5 border-t border-hairline pt-4">
                  <p className="text-xs font-semibold text-ink">
                    Verified Cast &amp; Characters
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-ink-body">
                    {selectedMovie.cast.slice(0, 4).map((member) => (
                      <li key={`${member.actor}-${member.character}`}>
                        <span className="font-medium text-ink">
                          {member.actor}
                        </span>{' '}
                        <span className="text-ink-muted">
                          as {member.character}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 border-t border-hairline pt-4">
                <p className="text-xs font-semibold text-ink">
                  Streaming &amp; Availability
                </p>
                <p className="mt-1 text-sm text-ink-body">
                  {selectedMovie.streamingServices.join(' · ')}
                </p>

                {selectedMovie.groundingSources.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
                    {selectedMovie.groundingSources.slice(0, 2).map((src) => (
                      <a
                        key={src.uri}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-plum-dark underline underline-offset-2 hover:text-sage-dark"
                      >
                        <span className="truncate max-w-[200px]">
                          {src.title}
                        </span>
                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {mintError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-plum/30 bg-plum/5 px-3.5 py-2.5 text-xs font-medium text-plum-dark"
                >
                  {mintError}
                </p>
              )}

              {/* Primary Action: Mint Covert Link */}
              <div className="mt-6 border-t border-hairline pt-5">
                <button
                  type="button"
                  onClick={() => void mintInviteForMovie(selectedMovie)}
                  disabled={minting}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-plum px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-plum-dark disabled:opacity-60 whitespace-nowrap"
                >
                  <Link2 className="h-4 w-4" aria-hidden="true" />
                  {minting
                    ? 'Sealing Covert Invitation...'
                    : 'Mint Covert Invitation Link'}
                </button>

                {mintedInvite && (
                  <div
                    aria-live="polite"
                    className="mt-4 space-y-3 border-t border-hairline pt-4"
                  >
                    <p className="text-xs font-semibold text-sage-dark">
                      Covert link sealed — movie title encrypted and hidden from
                      URL
                    </p>
                    <div className="rounded-xl border border-hairline bg-paper px-3 py-2.5 font-mono text-xs text-ink-body break-all">
                      {shareUrlDisplay}
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => void handleCopyLink()}
                        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-hairline bg-paper-elevated px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink/40 whitespace-nowrap"
                      >
                        {copied ? (
                          <>
                            <Check
                              className="h-4 w-4 text-sage"
                              aria-hidden="true"
                            />
                            Copied Link
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" aria-hidden="true" />
                            Copy Link
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onLaunchParlor(mintedInvite.token)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-sage px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sage-dark whitespace-nowrap"
                      >
                        Preview Parlor Quiz
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>

        {/* Four-Act Editorial Strip */}
        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="mt-20 border-t border-hairline pt-12"
        >
          <div className="max-w-2xl">
            <h2
              id="how-it-works-heading"
              className="font-serif text-3xl font-bold text-ink sm:text-4xl"
            >
              How the Four-Act Disguise Unfolds
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-body">
              Every claim remains technically true—just reframed through
              19th-century social etiquette until the curtain lifts.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-t-2 border-plum pt-4">
              <p className="font-serif text-2xl font-bold italic text-plum-dark">
                Act I
              </p>
              <h3 className="mt-1 font-serif text-xl font-bold text-ink">
                Secret Setup
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Pick a starter thriller or search any movie. Its dossier is
                sealed inside an encrypted link with zero title spoilers.
              </p>
            </div>

            <div className="border-t-2 border-sage pt-4">
              <p className="font-serif text-2xl font-bold italic text-sage-dark">
                Act II
              </p>
              <h3 className="mt-1 font-serif text-xl font-bold text-ink">
                Parlor Mood Quiz
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                She opens a serene Regency salon and answers four questions on
                estate scandals, brooding heroes, and atmospheric settings.
              </p>
            </div>

            <div className="border-t-2 border-honey pt-4">
              <p className="font-serif text-2xl font-bold italic text-honey-dark">
                Act III
              </p>
              <h3 className="mt-1 font-serif text-xl font-bold text-ink">
                Austen Pitch &amp; Plate
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Gemini maps real plot facts into Regency prose alongside a
                bespoke period-drama oil painting—zero mentions of explosions.
              </p>
            </div>

            <div className="border-t-2 border-plum pt-4">
              <p className="font-serif text-2xl font-bold italic text-plum-dark">
                Act IV
              </p>
              <h3 className="mt-1 font-serif text-xl font-bold text-ink">
                Velvet Reveal &amp; Veto
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                One click unveils the real movie, side-by-side trope proof,
                streaming links, and a Mercy Veto for real period romances.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-paper py-8 text-xs text-ink-muted">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-5 sm:flex-row sm:items-center sm:px-8">
          <p>
            The Parlor Dispatch · Film metadata and streaming availability
            grounded via Google Search.
          </p>
          <p>
            Keep custom salutations fun and avoid entering sensitive personal
            details.
          </p>
        </div>
      </footer>
    </div>
  );
}
