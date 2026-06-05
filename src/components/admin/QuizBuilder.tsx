"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ChoiceState = { id?: string; text: string; isCorrect: boolean };
type QuestionState = {
  id: string;
  order: number;
  prompt: string;
  choices: ChoiceState[];
};

export default function QuizBuilder({
  quizId,
  initialPassingScore,
  initialMaxAttempts,
  initialQuestions,
}: {
  quizId: string;
  initialPassingScore: number;
  initialMaxAttempts: number | null;
  initialQuestions: QuestionState[];
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);

  // --- Quiz settings ---
  const [passingScore, setPassingScore] = useState(initialPassingScore);
  const [maxAttempts, setMaxAttempts] = useState<number | "">(
    initialMaxAttempts ?? "",
  );
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  async function saveSettings() {
    setSavingSettings(true);
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passingScore,
          maxAttempts: maxAttempts === "" ? null : maxAttempts,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setSettingsDirty(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  }

  // --- Question CRUD ---
  async function createQuestion(payload: {
    prompt: string;
    choices: ChoiceState[];
  }) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const { question } = await res.json();
      setQuestions((curr) => [...curr, question]);
      setShowAdd(false);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function updateQuestion(
    id: string,
    payload: { prompt: string; choices: ChoiceState[] },
  ) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/quizzes/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const { question } = await res.json();
      setQuestions((curr) =>
        curr.map((q) => (q.id === id ? { ...q, ...question } : q)),
      );
      setEditingId(null);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Delete this question?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/quizzes/questions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setQuestions((curr) =>
        curr
          .filter((q) => q.id !== id)
          .map((q, i) => ({ ...q, order: i + 1 })),
      );
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function moveQuestion(id: string, direction: "up" | "down") {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/quizzes/questions/${id}/reorder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction }),
        },
      );
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setQuestions((curr) => {
        const idx = curr.findIndex((q) => q.id === id);
        const otherIdx = direction === "up" ? idx - 1 : idx + 1;
        if (otherIdx < 0 || otherIdx >= curr.length) return curr;
        const next = [...curr];
        [next[idx], next[otherIdx]] = [next[otherIdx], next[idx]];
        return next.map((q, i) => ({ ...q, order: i + 1 }));
      });
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Settings */}
      <div className="bg-white rounded-xl border border-brand-border p-6">
        <h2 className="text-sm tracking-wider uppercase text-brand-muted mb-4">
          Quiz settings
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
              Pass mark (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => {
                setPassingScore(Number(e.target.value));
                setSettingsDirty(true);
              }}
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
              disabled={savingSettings}
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
              Max attempts (blank = unlimited)
            </label>
            <input
              type="number"
              min={1}
              value={maxAttempts}
              onChange={(e) => {
                const v = e.target.value;
                setMaxAttempts(v === "" ? "" : Number(v));
                setSettingsDirty(true);
              }}
              placeholder="Unlimited"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
              disabled={savingSettings}
            />
          </div>
        </div>
        {settingsDirty && (
          <button
            type="button"
            onClick={saveSettings}
            disabled={savingSettings}
            className="mt-4 px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
          >
            {savingSettings ? "Saving…" : "Save settings"}
          </button>
        )}
      </div>

      {/* Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm tracking-wider uppercase text-brand-muted">
            Questions ({questions.length})
          </h2>
          {!showAdd && (
            <button
              type="button"
              onClick={() => {
                setShowAdd(true);
                setEditingId(null);
              }}
              className="px-4 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors"
              disabled={busy}
            >
              + Add question
            </button>
          )}
        </div>

        {showAdd && (
          <div className="mb-4">
            <QuestionForm
              mode="create"
              onSubmit={createQuestion}
              onCancel={() => setShowAdd(false)}
              busy={busy}
            />
          </div>
        )}

        <ul className="space-y-3">
          {questions.map((q, i) => (
            <li
              key={q.id}
              className="bg-white rounded-xl border border-brand-border overflow-hidden"
            >
              {editingId === q.id ? (
                <QuestionForm
                  mode="edit"
                  initialValues={{ prompt: q.prompt, choices: q.choices }}
                  onSubmit={(payload) => updateQuestion(q.id, payload)}
                  onCancel={() => setEditingId(null)}
                  busy={busy}
                />
              ) : (
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-brand-surface text-brand-muted flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                        {q.order}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-brand-primary">
                          {q.prompt}
                        </p>
                        <ul className="mt-2 space-y-1">
                          {q.choices.map((c) => (
                            <li
                              key={c.id ?? c.text}
                              className={`text-sm flex items-start gap-2 ${c.isCorrect ? "text-brand-sage font-medium" : "text-brand-muted"}`}
                            >
                              <span className="shrink-0 mt-0.5">
                                {c.isCorrect ? "✓" : "○"}
                              </span>
                              <span>{c.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveQuestion(q.id, "up")}
                        disabled={busy || i === 0}
                        className="w-8 h-8 rounded hover:bg-brand-surface disabled:opacity-30 disabled:hover:bg-transparent text-brand-muted"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuestion(q.id, "down")}
                        disabled={busy || i === questions.length - 1}
                        className="w-8 h-8 rounded hover:bg-brand-surface disabled:opacity-30 disabled:hover:bg-transparent text-brand-muted"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(q.id);
                          setShowAdd(false);
                        }}
                        disabled={busy}
                        className="px-3 py-1.5 text-xs text-brand-primary border border-brand-border rounded-full hover:bg-brand-surface"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(q.id)}
                        disabled={busy}
                        className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}

          {questions.length === 0 && !showAdd && (
            <li className="text-center py-12 text-brand-muted bg-white rounded-xl border border-brand-border">
              No questions yet. Click &ldquo;Add question&rdquo; to create one.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// --- Question form ---

function QuestionForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  busy,
}: {
  mode: "create" | "edit";
  initialValues?: { prompt: string; choices: ChoiceState[] };
  onSubmit: (payload: { prompt: string; choices: ChoiceState[] }) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? "");
  const [choices, setChoices] = useState<ChoiceState[]>(
    initialValues?.choices ?? [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  );

  function updateChoice(i: number, patch: Partial<ChoiceState>) {
    setChoices((curr) =>
      curr.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    );
  }

  function addChoice() {
    setChoices((curr) => [...curr, { text: "", isCorrect: false }]);
  }

  function removeChoice(i: number) {
    if (choices.length <= 2) return;
    setChoices((curr) => curr.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Prompt is required");
      return;
    }
    const filled = choices.filter((c) => c.text.trim());
    if (filled.length < 2) {
      alert("Need at least 2 choices with text");
      return;
    }
    if (!filled.some((c) => c.isCorrect)) {
      alert("Mark at least one correct choice");
      return;
    }
    onSubmit({ prompt: prompt.trim(), choices: filled });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-surface/30 border border-brand-border rounded-xl p-5 space-y-4"
    >
      <h3 className="font-medium text-brand-primary">
        {mode === "create" ? "New question" : "Edit question"}
      </h3>

      <div>
        <label className="block text-xs tracking-wider uppercase text-brand-muted mb-1.5">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-brand-border rounded-lg bg-white text-brand-primary focus:outline-none focus:border-brand-sage"
          placeholder="e.g. Which of the following is a principle of Pilates?"
          disabled={busy}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs tracking-wider uppercase text-brand-muted">
            Choices · tick the correct one(s)
          </label>
          <button
            type="button"
            onClick={addChoice}
            disabled={busy}
            className="text-xs text-brand-sage hover:text-brand-sage-dark"
          >
            + Add choice
          </button>
        </div>
        <ul className="space-y-2">
          {choices.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={c.isCorrect}
                onChange={(e) =>
                  updateChoice(i, { isCorrect: e.target.checked })
                }
                disabled={busy}
                className="w-4 h-4 accent-brand-sage shrink-0"
                title="Mark correct"
              />
              <input
                type="text"
                value={c.text}
                onChange={(e) => updateChoice(i, { text: e.target.value })}
                disabled={busy}
                placeholder={`Choice ${i + 1}`}
                className="flex-1 px-3 py-1.5 border border-brand-border rounded-lg bg-white text-brand-primary text-sm focus:outline-none focus:border-brand-sage"
              />
              <button
                type="button"
                onClick={() => removeChoice(i)}
                disabled={busy || choices.length <= 2}
                className="text-brand-muted hover:text-red-600 disabled:opacity-30 px-2"
                title="Remove choice"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 text-sm bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
        >
          {mode === "create" ? "Create question" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="px-5 py-2 text-sm text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
