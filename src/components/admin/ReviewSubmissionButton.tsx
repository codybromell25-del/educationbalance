"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewSubmissionButton({
  submissionId,
}: {
  submissionId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="shrink-0 px-4 py-2 text-xs tracking-wider uppercase rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Mark reviewed"}
    </button>
  );
}
