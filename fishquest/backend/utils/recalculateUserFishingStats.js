import Logs from "../models/Logs.js";
import UserFishingStats from "../models/UserFishingStats.js";

export async function recalculateUserFishingStats(userId) {
  const logs = await Logs.find({ userId });

  const stats = {
    userId,
    totalLogs: logs.length,
    totalCatches: 0,
    skunkedCount: 0,

    species: {},
    baits: {},
    hooks: {},
    weights: {},
    poles: {},
    methods: {},
    weather: {},

    biggestFish: null,
    longestFish: null,
  };

  for (const log of logs) {
    const caughtFish = !log.skunked && log.speciesId;
    const baitId = log.baitId || log.rigSnapshot?.baitId;

    if (baitId) {
      increment(stats.baits, baitId);
    }

    if (caughtFish) {
      stats.totalCatches++;

      increment(stats.species, log.speciesId);

      if (log.method) increment(stats.methods, log.method);
      if (log.weather) increment(stats.weather, log.weather);

      if (log.rigSnapshot) {
        if (log.rigSnapshot.hookId) {
          increment(stats.hooks, log.rigSnapshot.hookId);
        }

        if (log.rigSnapshot.weightId) {
          increment(stats.weights, log.rigSnapshot.weightId);
        }

        if (log.rigSnapshot.poleId) {
          increment(stats.poles, log.rigSnapshot.poleId);
        }
      }

      if (log.weight) {
        if (!stats.biggestFish || log.weight > stats.biggestFish.weight) {
          stats.biggestFish = {
            logId: log._id,
            speciesId: log.speciesId,
            speciesName: log.speciesName,
            weight: log.weight,
          };
        }
      }

      if (log.length) {
        if (!stats.longestFish || log.length > stats.longestFish.length) {
          stats.longestFish = {
            logId: log._id,
            speciesId: log.speciesId,
            speciesName: log.speciesName,
            length: log.length,
          };
        }
      }
    } else {
      stats.skunkedCount++;
    }
  }

  const updatedStats = await UserFishingStats.findOneAndUpdate(
    { userId },
    stats,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  return updatedStats;
}

function increment(obj, key) {
  if (!key) return;
  obj[key] = (obj[key] || 0) + 1;
}
