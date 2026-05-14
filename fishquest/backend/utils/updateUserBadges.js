import Log from "../models/Logs.js";
import User from "../models/User.js";
import { recalculateUserBadges } from "./recalculateUserBadges.js";

export async function updateUserBadges(userId) {
  const logs = await Log.find({ userId });
  const user = await User.findById(userId);

  if (!user) return null;

  user.badges = recalculateUserBadges(logs, user.badges);

  await user.save();

  return user.badges;
}
