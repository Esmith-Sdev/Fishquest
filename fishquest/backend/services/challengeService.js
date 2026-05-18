import ChallengeTemplate from "../models/ChallengeTemplate.js";
import UserChallenge from "../models/UserChallenge.js";

export async function assignStaticChallenges(userId) {
  const staticTemplates = await ChallengeTemplate.find({
    scheduleType: "static",
  });

  const existingChallenges = await UserChallenge.find({
    userId,
    templateKey: { $in: staticTemplates.map((template) => template.id) },
  });

  const existingKeys = new Set(
    existingChallenges.map((challenge) => challenge.templateKey),
  );

  const newChallenges = staticTemplates
    .filter((template) => !existingKeys.has(template.id))
    .map((template) => ({
      userId,
      templateId: template._id,
      templateKey: template.id,
      progress: 0,
      isFinished: false,
      assignedAt: new Date(),
      expiresAt: null,
      completedAt: null,
    }));

  if (newChallenges.length > 0) {
    await UserChallenge.insertMany(newChallenges);
  }
}
export async function assignDailyChallenges(userId) {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const existingDaily = await UserChallenge.find({
    userId,
    expiresAt: { $gte: startOfDay },
  });

  if (existingDaily.length > 0) {
    return existingDaily;
  }

  const dailyTemplates = await ChallengeTemplate.find({
    scheduleType: "daily",
  });

  const shuffled = [...dailyTemplates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  const newChallenges = selected.map((template) => ({
    userId,
    templateId: template._id,
    templateKey: template.id,
    progress: 0,
    isFinished: false,
    assignedAt: now,
    expiresAt: endOfDay,
  }));

  return await UserChallenge.insertMany(newChallenges);
}

export async function initializeChallengesForUser(userId) {
  await assignStaticChallenges(userId);
  await assignDailyChallenges(userId);

  const challenges = await UserChallenge.find({ userId }).populate(
    "templateId",
  );

  return challenges.map((c) => ({
    id: c.templateId.id,
    userChallengeId: c._id,
    title: c.templateId.title,
    type: c.templateId.type,
    scheduleType: c.templateId.scheduleType,
    fishKey: c.templateId.fishKey,
    goal: c.templateId.goal,
    rewardXp: c.templateId.rewardXp,
    timeLimit: c.templateId.timeLimit,
    progress: c.progress,
    isFinished: c.isFinished,
    assignedAt: c.assignedAt,
    expiresAt: c.expiresAt,
    availableAgainAt: c.availableAgainAt,
    lastCompletedDate: c.lastCompletedDate,
  }));
}
