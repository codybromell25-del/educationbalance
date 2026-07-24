"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit button that disables and switches label while the parent
 * form's server action is running. Reused by post + reply forms.
 */
export default function SubmitButton({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "px-5 py-2 text-sm bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-60"
      }
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
