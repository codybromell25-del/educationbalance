"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type CohortOption = {
  id: string;
  name: string;
  isActive: boolean;
  isArchived: boolean;
};

export default function CreateUserForm({
  cohorts,
  defaultCohortId,
}: {
  cohorts: CohortOption[];
  defaultCohortId: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pathway, setPathway] = useState("COMPREHENSIVE");
  const [cohortId, setCohortId] = useState<string>(defaultCohortId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        pathway,
        cohortId: cohortId || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create user");
      setLoading(false);
      return;
    }

    setName("");
    setEmail("");
    setPassword("");
    setPathway("COMPREHENSIVE");
    setCohortId(defaultCohortId ?? "");
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 bg-brand-primary text-white text-sm tracking-wider uppercase rounded-full hover:bg-brand-primary/90 transition-colors"
      >
        + New User
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-brand-border p-6">
      <h3 className="font-medium text-brand-primary mb-4">Create New User</h3>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-brand-muted mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
            placeholder="Full name"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-brand-muted mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
            placeholder="email@example.com"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-brand-muted mb-1">
            Password
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
            placeholder="Temporary password"
          />
        </div>
        <div className="min-w-[180px]">
          <label className="block text-xs text-brand-muted mb-1">
            Pathway
          </label>
          <select
            value={pathway}
            onChange={(e) => setPathway(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
          >
            <option value="COMPREHENSIVE">Comprehensive</option>
            <option value="MAT">Mat only</option>
            <option value="REFORMER">Reformer only</option>
          </select>
        </div>
        <div className="min-w-[200px]">
          <label className="block text-xs text-brand-muted mb-1">Cohort</label>
          <select
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-background text-sm"
          >
            <option value="">No cohort</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isArchived ? " (archived)" : c.isActive ? "" : " (inactive)"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-primary text-white text-sm rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-brand-error mt-3">{error}</p>}
    </div>
  );
}
