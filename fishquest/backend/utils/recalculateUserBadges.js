// utils/recalculateUserBadges.js
import { BADGES } from "../data/badges.config.js";
import { verifyBadgeCompletion } from "./verifyBadgeCompletion.js";

export function recalculateUserBadges(logs = [], existingBadges = []) {
  return BADGES.map((badge) => {
    const result = verifyBadgeCompletion(badge, logs);

    const existing = existingBadges.find(
      (userBadge) => userBadge.badgeId === badge.id,
    );

    return {
      badgeId: badge.id,
      progress: result.progress,
      goal: result.goal,
      earned: result.passed,
      earnedAt: result.passed ? existing?.earnedAt || new Date() : null,
    };
  });
}
