import { LEVELS } from "../config/levels.config.js";

export function calculateLevel(xp) {
  let currentLevel = LEVELS[0];

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
    } else {
      break;
    }
  }

  return currentLevel;
}
