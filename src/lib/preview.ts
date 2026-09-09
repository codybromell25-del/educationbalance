import { cookies } from "next/headers";
import type { Pathway } from "@prisma/client";

/**
 * Admin "preview as student" mode.
 *
 * An ADMIN can view the student dashboard and any unit exactly as a
 * student on a chosen pathway would see it — including units that are
 * still locked for real students — without changing a single date or
 * visibility flag. State is a short-lived, httpOnly cookie holding the
 * pathway being previewed.
 *
 * The cookie alone grants nothing: every reader also checks
 * `session.user.role === "ADMIN"`. A student who sets the cookie by
 * hand gets exactly what they had before.
 */
export const PREVIEW_COOKIE = "balance-preview";

/** Four hours — long enough for an authoring session, short enough to self-clear if forgotten. */
export const PREVIEW_MAX_AGE = 60 * 60 * 4;

const VALID = new Set<string>(["MAT", "REFORMER", "COMPREHENSIVE"]);

export function isPathway(v: unknown): v is Pathway {
  return typeof v === "string" && VALID.has(v);
}

/**
 * The pathway being previewed, or null when preview is off. Only
 * meaningful after the caller has verified the session role is ADMIN —
 * this function does not check auth itself.
 */
export async function getPreviewPathway(): Promise<Pathway | null> {
  const v = (await cookies()).get(PREVIEW_COOKIE)?.value;
  return isPathway(v) ? v : null;
}

export const PATHWAY_LABEL: Record<Pathway, string> = {
  MAT: "Mat",
  REFORMER: "Reformer",
  COMPREHENSIVE: "Comprehensive",
};
