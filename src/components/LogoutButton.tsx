"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
    >
      Sign Out
    </button>
  );
}
