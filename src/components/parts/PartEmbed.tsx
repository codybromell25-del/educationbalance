"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type LastResult = {
  score: number | null;
  passed: boolean | null;
  completedAt: string;
};

const MIN_HEIGHT = 160;
const MAX_HEIGHT = 6000;

/**
 * Injected ahead of the author's HTML inside the sandbox. Two jobs:
 *  1. Report the document height so the iframe fits its content.
 *  2. Expose `balance.report({ score, passed, payload })` so an exercise
 *     can hand back a result with one line.
 * It runs INSIDE the sandbox, so it has no more reach than the author's
 * own code — it can only talk to us via postMessage.
 */
const BOOTSTRAP = `<script>(function(){
var post=function(){try{parent.postMessage({balance:"height",height:Math.ceil(document.documentElement.scrollHeight)},"*")}catch(e){}};
window.balance={report:function(d){try{parent.postMessage(Object.assign({balance:"result"},d||{}),"*")}catch(e){}}};
window.addEventListener("load",post);
if(window.ResizeObserver){new ResizeObserver(post).observe(document.documentElement)}
setTimeout(post,50);setTimeout(post,600);
})();</script>`;

/**
 * Renders an author-built interactive exercise (EMBED part) in a
 * sandboxed iframe and records any result it reports.
 *
 * Security: `sandbox="allow-scripts"` WITHOUT `allow-same-origin`. The
 * frame gets an opaque origin, so its scripts can't read our cookies,
 * DOM, or storage — the only channel out is postMessage, and we only
 * act on messages whose `source` is this exact frame.
 */
export default function PartEmbed({
  partId,
  html,
  lastResult,
}: {
  partId: string;
  html: string;
  lastResult: LastResult | null;
}) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const savingRef = useRef(false);
  const [height, setHeight] = useState(320);
  const [result, setResult] = useState<LastResult | null>(lastResult);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function record(data: {
      score?: unknown;
      passed?: unknown;
      payload?: unknown;
    }) {
      savingRef.current = true;
      setSaving(true);
      setError(null);
      try {
        const res = await fetch(`/api/embed/${partId}/result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = (await res.json().catch(() => ({}))) as {
          score?: number | null;
          passed?: boolean | null;
          completedAt?: string;
          error?: string;
        };
        if (!res.ok) {
          throw new Error(json.error ?? `Could not save your result (HTTP ${res.status})`);
        }
        setResult({
          score: json.score ?? null,
          passed: json.passed ?? null,
          completedAt: json.completedAt ?? new Date().toISOString(),
        });
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save your result");
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    }

    function onMessage(e: MessageEvent) {
      // Sandboxed srcdoc frames have origin "null", so e.origin is useless.
      // The identity check on e.source is what guarantees this came from
      // OUR frame and not any other window that can reach us.
      const frame = iframeRef.current;
      if (!frame || e.source !== frame.contentWindow) return;
      const d = e.data as { balance?: unknown } | null;
      if (!d || typeof d !== "object" || typeof d.balance !== "string") return;

      if (d.balance === "height") {
        const h = Number((d as { height?: unknown }).height);
        if (Number.isFinite(h)) {
          setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.ceil(h))));
        }
        return;
      }
      if (d.balance === "result") {
        if (savingRef.current) return; // ignore duplicate fires mid-save
        const { score, passed, payload } = d as {
          score?: unknown;
          passed?: unknown;
          payload?: unknown;
        };
        void record({ score, passed, payload });
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [partId, router]);

  if (!html.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-brand-border bg-brand-surface p-8 text-center">
        <p className="text-sm text-brand-muted">Interactive content coming soon</p>
      </div>
    );
  }

  const status = saving
    ? "Saving your result…"
    : result
      ? [
          `Recorded ${new Date(result.completedAt).toLocaleDateString("en-IE", {
            day: "numeric",
            month: "short",
          })}`,
          result.score !== null ? `${result.score}%` : null,
          result.passed === true
            ? "Passed"
            : result.passed === false
              ? "Not passed"
              : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : "Your result is saved automatically when you finish.";

  return (
    <div className="space-y-3">
      <iframe
        ref={iframeRef}
        title="Interactive exercise"
        sandbox="allow-scripts"
        srcDoc={BOOTSTRAP + html}
        style={{ height }}
        className="block w-full border-0 rounded-xl bg-white"
      />
      <p
        className={
          "text-xs " +
          (result?.passed === true
            ? "text-brand-success"
            : result?.passed === false
              ? "text-brand-sage"
              : "text-brand-muted")
        }
      >
        {status}
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
