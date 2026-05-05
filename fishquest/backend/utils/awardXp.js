import User from "../models/User.js";
import { calculateLevel } from "./calculateLevel.js";

export async function awardXp(userId, earnedXp) {
  const user = await User.findById(userId);

  user.xp += earnedXp;

  const levelData = calculateLevel(user.xp);

  user.level = levelData.level;
  user.levelTitle = levelData.title;

  await user.save();

  return user;
}
