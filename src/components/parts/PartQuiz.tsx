"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Choice = { id: string; text: string };
type Question = { id: string; prompt: string; choices: Choice[] };

type LastResult = { score: number; passed: boolean };

type ReviewItem = {
  questionId: string;
  prompt: string;
  chosenChoiceId: string | null;
  chosenText: string | null;
  correctChoiceId: string | null;
  correctText: string | null;
  wasCorrect: boolean;
};

type AttemptResponse = LastResult & { review?: ReviewItem[] };

export default function PartQuiz({
  quizId,
  questions,
  passingScore,
  lastResult,
}: {
  quizId: string;
  questions: Question[];
  passingScore: number;
  lastResult: LastResult | null;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LastResult | null>(lastResult);
  const [review, setReview] = useState<ReviewItem[] | null>(null);
  const [showForm, setShowForm] = useState(!lastResult);
  const [error, setError] = useState<string | null>(null);

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-border bg-brand-surface p-8 text-center">
        <p className="text-sm text-brand-muted">Quiz coming soon</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.keys(answers).length !== questions.length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quiz/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submit failed");
      }
      const data = (await res.json()) as AttemptResponse;
      setResult({ score: data.score, passed: data.passed });
      setReview(data.review ?? null);
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  function retake() {
    setAnswers({});
    setResult(null);
    setReview(null);
    setShowForm(true);
    setError(null);
  }

  if (result && !showForm) {
    return (
      <div className="space-y-6">
        <div
          className={`rounded-xl border p-8 text-center ${
            result.passed
              ? "border-brand-success/30 bg-brand-success/5"
              : "border-brand-sage/30 bg-brand-surface"
          }`}
        >
          <p
            className={`text-xs tracking-[0.3em] uppercase mb-3 ${
              result.passed ? "text-brand-success" : "text-brand-sage"
            }`}
          >
            {result.passed ? "Passed" : "Not yet"}
          </p>
          <p className="text-5xl font-light text-brand-primary mb-2">
            {result.score}%
          </p>
          <p className="text-sm text-brand-muted mb-6">
            Pass mark: {passingScore}%
          </p>
          <button
            onClick={retake}
            className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
          >
            {result.passed ? "Retake" : "Try again"}
          </button>
        </div>

        {review && review.length > 0 && (
          <div>
            <h3 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
              Review your answers
            </h3>
            <ul className="space-y-4">
              {review.map((item, i) => (
                <li
                  key={item.questionId}
                  className={`rounded-xl border p-5 ${
                    item.wasCorrect
                      ? "border-brand-success/30 bg-brand-success/5"
                      : "border-red-200 bg-red-50/40"
                  }`}
                >
                  <p className="font-medium text-brand-primary mb-3">
                    <span className="text-brand-muted mr-2">{i + 1}.</span>
                    {item.prompt}
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2">
                      <span
                        className={`shrink-0 mt-0.5 ${item.wasCorrect ? "text-brand-success" : "text-red-600"}`}
                      >
                        {item.wasCorrect ? "✓" : "✗"}
                      </span>
                      <span className="text-brand-primary/80">
                        <span className="text-brand-muted">Your answer:</span>{" "}
                        {item.chosenText ?? (
                          <em className="text-brand-muted">No answer</em>
                        )}
                      </span>
                    </div>
                    {!item.wasCorrect && item.correctText && (
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 mt-0.5 text-brand-success">
                          ✓
                        </span>
                        <span className="text-brand-primary/80">
                          <span className="text-brand-muted">
                            Correct answer:
                          </span>{" "}
                          {item.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((q, qi) => (
        <fieldset key={q.id}>
          <legend className="text-base font-medium text-brand-primary mb-4">
            {qi + 1}. {q.prompt}
          </legend>
          <div className="space-y-2">
            {q.choices.map((c) => (
              <label
                key={c.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  answers[q.id] === c.id
                    ? "border-brand-sage bg-brand-sage/5"
                    : "border-brand-border bg-white hover:border-brand-sage/40"
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={c.id}
                  checked={answers[q.id] === c.id}
                  onChange={() =>
                    setAnswers({ ...answers, [q.id]: c.id })
                  }
                  className="accent-brand-sage"
                />
                <span className="text-sm text-brand-primary">{c.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-brand-muted">
          {Object.keys(answers).length} of {questions.length} answered · pass mark {passingScore}%
        </p>
        <button
          type="submit"
          disabled={loading || !allAnswered}
          className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit answers"}
        </button>
      </div>
    </form>
  );
}
