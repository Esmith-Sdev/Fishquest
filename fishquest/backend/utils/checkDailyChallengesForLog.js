import UserChallenge from "../models/UserChallenge.js";
import User from "../models/User.js";
import Logs from "../models/Logs.js";
import { verifyChallengeCompletion } from "./verifyChallengeCompletion.js";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function checkDailyChallengesForLog(userId, log) {
  const todayKey = getTodayKey();

  const activeChallenges = await UserChallenge.find({
    userId,
    isFinished: false,
    // only include this if you added dateKey to UserChallenge
    dateKey: todayKey,
  }).populate("templateId");

  const previousLogs = await Logs.find({
    userId,
    _id: { $ne: log._id },
  });

  const completedChallenges = [];

  for (const userChallenge of activeChallenges) {
    const template = userChallenge.templateId;

    if (!template) continue;

    const result = verifyChallengeCompletion(
      log,
      template,
      previousLogs,
      userChallenge,
    );

    if (typeof result.progress === "number") {
      userChallenge.progress = result.progress;
    } else if (result.passed) {
      userChallenge.progress = (userChallenge.progress || 0) + 1;
    }

    if (!result.passed) {
      await userChallenge.save();
      continue;
    }

    if (userChallenge.progress >= template.goal) {
      userChallenge.isFinished = true;
      userChallenge.completedAt = new Date();
      userChallenge.lastCompletedDate = todayKey;

      const xpAwarded = template.rewardXp || 0;

      await User.findByIdAndUpdate(userId, {
        $inc: { xp: xpAwarded },
      });

      completedChallenges.push({
        id: template.id,
        title: template.title,
        xpAwarded,
      });
    }

    await userChallenge.save();
  }

  return completedChallenges;
}
