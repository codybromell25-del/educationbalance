import type { Section, Progress } from "@prisma/client";

export type SectionWithProgress = Section & { progress: Progress[] };

export type AccessResult =
  | { accessible: true; reason: null }
  | {
      accessible: false;
      reason: "locked-by-date" | "locked-by-prerequisite";
      blockingPreviousTitle?: string;
    };

/**
 * Determines whether a student can access a section.
 *
 * A section is accessible when BOTH:
 *   1. Its unlockDate has passed
 *   2. Either Section.requiresPriorCompletion is false, OR there is no
 *      previous section, OR the previous section is marked completed.
 *
 * The `previousSection` parameter must already have `progress` filtered
 * to the current user (page.tsx queries do this with
 * `progress: { where: { userId } }`).
 */
export function getSectionAccess(
  section: SectionWithProgress,
  previousSection: SectionWithProgress | null,
  now: Date = new Date(),
): AccessResult {
  if (new Date(section.unlockDate) > now) {
    return { accessible: false, reason: "locked-by-date" };
  }

  if (section.requiresPriorCompletion && previousSection) {
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
  now: Date = new Date(),
): boolean {
  return getSectionAccess(section, previousSection, now).accessible;
}
