import type { Section, Progress, Pathway } from "@prisma/client";

export type SectionWithProgress = Section & { progress: Progress[] };

export type AccessResult =
  | { accessible: true; reason: null }
  | {
      accessible: false;
      reason:
        | "locked-by-date"
        | "locked-by-prerequisite"
        | "hidden-by-pathway";
      blockingPreviousTitle?: string;
    };

/**
 * Returns whether a section is visible at all to the given pathway.
 * COMPREHENSIVE (and staff-null pathways) always see everything;
 * MAT and REFORMER only see sections whose corresponding visibility
 * flag is true. The PDF specifies "locked means the unit never
 * appears for that pathway" so this is a hard filter — caller should
 * omit invisible sections from the student's course list entirely.
 */
export function isVisibleTo(
  section: Pick<Section, "visibleToMat" | "visibleToReformer">,
  pathway: Pathway | null,
): boolean {
  if (pathway === "MAT") return section.visibleToMat;
  if (pathway === "REFORMER") return section.visibleToReformer;
  return true; // COMPREHENSIVE and null-pathway users see everything
}

/**
 * Resolves the effective unlock date for a section, taking the
 * per-pathway value when set and falling back to the legacy single
 * unlockDate field.
 */
export function unlockDateFor(
  section: Pick<Section, "unlockDate" | "unlockDates">,
  pathway: Pathway | null,
): Date {
  const dates = section.unlockDates as
    | { MAT?: string; REFORMER?: string; COMPREHENSIVE?: string }
    | null
    | undefined;
  if (dates && pathway && typeof dates[pathway] === "string") {
    const parsed = new Date(dates[pathway] as string);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date(section.unlockDate);
}

/**
 * Determines whether a student can access a section.
 *
 * A section is accessible when ALL of:
 *   1. It's visible to the student's pathway (see isVisibleTo).
 *   2. Its pathway-appropriate unlock date has passed
 *      (unlockDates[pathway] or fallback unlockDate).
 *   3. Either a specific prerequisite section is set and completed,
 *      OR (fallback) requiresPriorCompletion is false, OR there is no
 *      previous section, OR the previous section is completed.
 *
 * `previousSection.progress` must already be filtered to the current
 * user. `prerequisiteCompleted` is passed in by the caller when the
 * section has an explicit prerequisiteId — the caller has the data
 * loaded and knows better than this pure function.
 */
export function getSectionAccess(
  section: SectionWithProgress,
  previousSection: SectionWithProgress | null,
  pathway: Pathway | null = null,
  prerequisiteCompleted: boolean | null = null,
  now: Date = new Date(),
): AccessResult {
  if (!isVisibleTo(section, pathway)) {
    return { accessible: false, reason: "hidden-by-pathway" };
  }

  if (unlockDateFor(section, pathway) > now) {
    return { accessible: false, reason: "locked-by-date" };
  }

  // Explicit prerequisite pointer takes precedence over the
  // "previous section" fallback.
  if (section.prerequisiteId) {
    if (prerequisiteCompleted !== true) {
      return {
        accessible: false,
        reason: "locked-by-prerequisite",
      };
    }
  } else if (section.requiresPriorCompletion && previousSection) {
    const prevCompleted = previousSection.progress[0]?.completed ?? false;
    if (!prevCompleted) {
      return {
        accessible: false,
        reason: "locked-by-prerequisite",
        blockingPreviousTitle: previousSection.title,
      };
    }
  }

  return { accessible: true, reason: null };
}

export function isSectionAccessible(
  section: SectionWithProgress,
  previousSection: SectionWithProgress | null,
  pathway: Pathway | null = null,
  prerequisiteCompleted: boolean | null = null,
  now: Date = new Date(),
): boolean {
  return getSectionAccess(
    section,
    previousSection,
    pathway,
    prerequisiteCompleted,
    now,
  ).accessible;
}
