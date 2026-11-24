import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../shared/catalog';
import type { QuizAnswers } from '../shared/types';

interface ParlorQuizProps {
  salutation: string;
  submitting: boolean;
  error: string | null;
  onComplete: (answers: QuizAnswers) => void;
}

export function ParlorQuiz({
  salutation,
  submitting,
  error,
  onComplete,
}: ParlorQuizProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[stepIndex];
  const selectedOptionId = answers[currentQuestion.id];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === QUIZ_QUESTIONS.length - 1;

  function handleSelect(optionId: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    setValidationError(null);
  }

  function handleNext() {
    if (!selectedOptionId) {
      setValidationError('Please choose the sentiment that best suits your evening.');
      return;
    }
    if (!isLast) {
      setStepIndex((idx) => idx + 1);
      setValidationError(null);
      return;
    }
    const complete: QuizAnswers = {
      scandal: answers.scandal ?? '',
      heroMood: answers.heroMood ?? '',
      setting: answers.setting ?? '',
      resolution: answers.resolution ?? '',
    };
    onComplete(complete);
  }

  function handleBack() {
    if (!isFirst) {
      setStepIndex((idx) => idx - 1);
      setValidationError(null);
    }
  }

  return (
    <section
      aria-labelledby="parlor-quiz-heading"
      className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="mb-8 border-b border-hairline pb-7">
        <p className="text-sm font-medium text-plum-dark">
          {currentQuestion.chapterLabel}
          <span aria-hidden="true" className="mx-2 text-ink-muted">
            ·
          </span>
          <span className="text-ink-muted">For {salutation}</span>
        </p>

        <h1
          id="parlor-quiz-heading"
          className="mt-3 font-serif text-4xl font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl"
        >
          {currentQuestion.prompt}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-body">
          Answer four brief parlor questions so our circulating library may
          curate a period drama tailored to your mood tonight.
        </p>

        <div
          className="mt-6 grid grid-cols-4 gap-2"
          aria-label={`Progress: step ${stepIndex + 1} of ${QUIZ_QUESTIONS.length}`}
        >
          {QUIZ_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className={`h-1 rounded-full transition-colors duration-200 ${
                idx <= stepIndex ? 'bg-plum' : 'bg-hairline'
              }`}
            />
          ))}
        </div>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="parlor-quiz-heading"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(option.id)}
              disabled={submitting}
              className={`group flex min-h-[104px] flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${
                isSelected
                  ? 'border-plum bg-paper-elevated shadow-sm ring-1 ring-plum/20'
                  : 'border-hairline bg-paper-elevated/70 hover:border-plum/50 hover:bg-paper-elevated'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-serif text-2xl font-bold leading-snug text-ink">
                  {option.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? 'border-plum bg-plum text-white'
                      : 'border-hairline bg-transparent text-transparent group-hover:border-plum/40'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {option.detail}
              </p>
            </button>
          );
        })}
      </div>

      {(validationError || error) && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-plum/30 bg-plum/5 px-4 py-3 text-sm font-medium text-plum-dark"
        >
          {validationError ?? error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={isFirst || submitting}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-hairline bg-paper-elevated px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-plum px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-plum-dark disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          {submitting
            ? 'Consulting the Library...'
            : isLast
              ? 'Reveal My Evening Selection'
              : 'Continue'}
          {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
