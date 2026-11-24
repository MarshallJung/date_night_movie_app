import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  fetchInvitationMeta,
  requestGrandReveal,
  requestMercyVeto,
  requestRegencyPitch,
  requestRegencyPoster,
} from '../lib/api';
import { AustenPitchView } from './AustenPitchView';
import { GrandRevealView } from './GrandRevealView';
import { ParlorQuiz } from './ParlorQuiz';
import { BeeEmblem } from './RegencyFlourish';
import type {
  DisguisedPitchResponse,
  InvitationMeta,
  MercyVetoResponse,
  QuizAnswers,
  RevealResponse,
} from '../shared/types';

interface ParlorExperienceProps {
  token: string;
  onReturnToSetup: () => void;
}

type ParlorStage = 'loading' | 'invalid' | 'quiz' | 'pitch' | 'reveal';

export function ParlorExperience({
  token,
  onReturnToSetup,
}: ParlorExperienceProps) {
  const [stage, setStage] = useState<ParlorStage>('loading');
  const [meta, setMeta] = useState<InvitationMeta | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchError, setPitchError] = useState<string | null>(null);
  const [pitch, setPitch] = useState<DisguisedPitchResponse | null>(null);

  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterError, setPosterError] = useState<string | null>(null);

  const [revealing, setRevealing] = useState(false);
  const [reveal, setReveal] = useState<RevealResponse | null>(null);

  const [mercyVeto, setMercyVeto] = useState<MercyVetoResponse | null>(null);
  const [mercyLoading, setMercyLoading] = useState(false);
  const [mercyError, setMercyError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setStage('loading');
    setLoadError(null);
    setPitch(null);
    setReveal(null);
    setMercyVeto(null);
    setPosterUrl(null);

    fetchInvitationMeta(token)
      .then((data) => {
        if (!active) return;
        setMeta(data);
        setStage('quiz');
      })
      .catch((err: unknown) => {
        if (!active) return;
        setLoadError(
          err instanceof Error
            ? err.message
            : 'Unable to open this parlor invitation.',
        );
        setStage('invalid');
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function paintLivePoster(posterPrompt: string, disguisedTitle: string) {
    setPosterLoading(true);
    setPosterError(null);
    try {
      const result = await requestRegencyPoster(
        token,
        posterPrompt,
        disguisedTitle,
      );
      setPosterUrl(result.imageDataUrl);
    } catch (err: unknown) {
      setPosterError(
        err instanceof Error
          ? err.message
          : 'Could not paint a new Regency portrait right now.',
      );
    } finally {
      setPosterLoading(false);
    }
  }

  async function handleQuizComplete(answers: QuizAnswers) {
    setQuizAnswers(answers);
    setPitchLoading(true);
    setPitchError(null);
    try {
      const pitchData = await requestRegencyPitch(token, answers);
      setPitch(pitchData);
      setStage('pitch');

      if (pitchData.presetPosterPath) {
        setPosterUrl(pitchData.presetPosterPath);
        setPosterError(null);
        setPosterLoading(false);
      } else {
        setPosterUrl(null);
        void paintLivePoster(pitchData.posterPrompt, pitchData.disguisedTitle);
      }
    } catch (err: unknown) {
      setPitchError(
        err instanceof Error
          ? err.message
          : 'Our circulating library hit a snag preparing your selection. Please try again.',
      );
    } finally {
      setPitchLoading(false);
    }
  }

  async function handleAcceptSelection() {
    if (!pitch) return;
    setRevealing(true);
    try {
      const revealData = await requestGrandReveal({
        token,
        revealNonce: pitch.revealNonce,
        disguisedTitle: pitch.disguisedTitle,
      });
      setReveal(revealData);
      setStage('reveal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setPitchError(
        err instanceof Error
          ? err.message
          : 'Could not draw back the curtain right now.',
      );
    } finally {
      setRevealing(false);
    }
  }

  async function handleTriggerMercyVeto() {
    if (!reveal) return;
    setMercyLoading(true);
    setMercyError(null);
    try {
      const res = await requestMercyVeto({
        householdServices: reveal.householdServices,
        answers: quizAnswers ?? undefined,
      });
      setMercyVeto(res);
    } catch (err: unknown) {
      setMercyError(
        err instanceof Error
          ? err.message
          : 'Could not fetch period romance recommendations right now.',
      );
    } finally {
      setMercyLoading(false);
    }
  }

  const isVelvet = stage === 'reveal';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isVelvet ? 'bg-velvet text-velvet-ink' : 'bg-paper text-ink'
      }`}
    >
      {/* Calm minimal Regency masthead (zero setup chrome or spoilers) */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          isVelvet
            ? 'border-velvet-hairline bg-velvet/95 text-velvet-ink'
            : 'border-hairline bg-paper/95 text-ink'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-2.5 min-w-0">
            <BeeEmblem className="h-5 w-5 shrink-0" />
            <span className="font-serif text-xl font-bold tracking-tight whitespace-nowrap shrink-0">
              The Parlor Dispatch
            </span>
          </div>
          <span
            className={`text-xs font-medium whitespace-nowrap shrink-0 ${
              isVelvet ? 'text-velvet-gold' : 'text-ink-muted'
            }`}
          >
            {isVelvet ? 'Grand Reveal' : 'Evening Consultation'}
          </span>
        </div>
      </header>

      <main>
        {stage === 'loading' && (
          <div
            aria-live="polite"
            className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-28 text-center"
          >
            <BeeEmblem className="h-10 w-10" />
            <h1 className="mt-5 font-serif text-3xl font-bold text-ink">
              Unsealing Your Parlor Invitation
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Preparing tonight’s period-drama consultation...
            </p>
          </div>
        )}

        {stage === 'invalid' && (
          <div className="mx-auto max-w-xl px-6 py-24 text-center">
            <h1 className="font-serif text-4xl font-bold text-ink">
              Invitation Seal Unrecognized
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-body">
              {loadError ??
                'This parlor link appears to have expired or been mistyped.'}
            </p>
            <button
              type="button"
              onClick={onReturnToSetup}
              className="mt-8 inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-plum px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-plum-dark whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Open the Setup Studio
            </button>
          </div>
        )}

        {stage === 'quiz' && meta && (
          <ParlorQuiz
            salutation={meta.salutation}
            submitting={pitchLoading}
            error={pitchError}
            onComplete={handleQuizComplete}
          />
        )}

        {stage === 'pitch' && meta && pitch && (
          <AustenPitchView
            salutation={meta.salutation}
            pitch={pitch}
            posterUrl={posterUrl}
            posterLoading={posterLoading}
            posterError={posterError}
            revealing={revealing}
            onRegeneratePoster={() =>
              void paintLivePoster(pitch.posterPrompt, pitch.disguisedTitle)
            }
            onAcceptSelection={() => void handleAcceptSelection()}
            onRetakeQuiz={() => setStage('quiz')}
          />
        )}

        {stage === 'reveal' && reveal && (
          <GrandRevealView
            reveal={reveal}
            posterUrl={posterUrl}
            mercyVeto={mercyVeto}
            mercyLoading={mercyLoading}
            mercyError={mercyError}
            onTriggerMercyVeto={() => void handleTriggerMercyVeto()}
            onCreateOwn={onReturnToSetup}
          />
        )}
      </main>

      {stage !== 'loading' && (
        <footer
          className={`border-t py-6 text-center text-xs ${
            isVelvet
              ? 'border-velvet-hairline bg-velvet text-velvet-muted'
              : 'border-hairline bg-paper text-ink-muted'
          }`}
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            The Parlor Dispatch · Movie metadata & streaming lookups grounded
            with Google Search · Keep quiz inputs lighthearted and personal-data
            free.
          </div>
        </footer>
      )}
    </div>
  );
}
