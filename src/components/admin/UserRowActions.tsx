"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserRowActions({
  user,
}: {
  user: { id: string; name: string; email: string };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Permanently delete ${user.name} (${user.email})? This removes ALL their progress, submissions, quiz attempts, hour logs, and questions. This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Delete failed");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  }

  async function handleResetPassword() {
    if (
      !confirm(
        `Generate a new temporary password for ${user.name} and email it to ${user.email}? Their current password will stop working.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Reset failed");
      }
      const { temporaryPassword } = await res.json();
      alert(
        `Password reset. New temporary password is:\n\n${temporaryPassword}\n\nIt has also been emailed to ${user.email}.`,
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSave}
        className="flex flex-wrap items-center gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          className="px-3 py-1.5 text-sm border border-brand-border rounded-lg w-32"
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          className="px-3 py-1.5 text-sm border border-brand-border rounded-lg w-48"
          placeholder="Email"
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="px-3 py-1.5 text-xs bg-brand-sage text-white rounded-full hover:bg-brand-sage-dark disabled:opacity-50"
        >
          {busy ? "…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setName(user.name);
            setEmail(user.email);
            setError(null);
          }}
          disabled={busy}
          className="px-3 py-1.5 text-xs text-brand-muted hover:text-brand-primary"
        >
          Cancel
        </button>
        {error && (
          <span className="text-xs text-red-600 basis-full">{error}</span>
        )}
      </form>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap justify-end">
      <button
        type="button"
        onClick={() => setEditing(true)}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-brand-primary border border-brand-border rounded-full hover:bg-brand-surface"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={handleResetPassword}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-brand-sage border border-brand-sage/30 rounded-full hover:bg-brand-sage/5 disabled:opacity-50"
      >
        Reset password
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
