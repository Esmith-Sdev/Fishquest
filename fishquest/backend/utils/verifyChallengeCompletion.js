import { AllSpecies } from "../data/species.config.js";

export function verifyChallengeCompletion(
  log,
  template,
  previousLogs = [],
  userChallenge,
) {
  const challengeId = template.id || template.templateKey;
  const caughtFish = !log.skunked && !!log.speciesId;

  const baitId = String(log.baitId || "").toLowerCase();
  const hookId = String(log.hookId || "").toLowerCase();
  const weightId = String(log.weightId || "").toLowerCase();
  const weather = String(log.weather || "").toLowerCase();

  const verificationMode = template.verificationMode || "auto";

  if (!challengeId) {
    return fail("Challenge template is missing an id.");
  }

  // Honor-system/manual challenges.
  // These only count if the user opened Create Log from that challenge card.
  if (verificationMode === "manual") {
    return wasLoggedFromThisChallenge(log, template)
      ? pass()
      : fail("This challenge must be logged from the challenge card.");
  }

  switch (challengeId) {
    // Timed challenges
    case "catch-ten-min":
    case "catch-thirty-min":
    case "catch-two-min": {
      if (!caughtFish) return fail("You need to catch a fish.");
      const start = userChallenge.startedAt;
      const logTime = new Date(log.date);

      if (!start) return fail("Challenge was never started");

      const elapsed = (logTime - start) / 1000;

      return elapsed <= template.timeLimit
        ? pass()
        : fail("Time limit exceeded");
      return pass();
    }

    // Manual/honor-system challenges
    case "first-cast":
    case "lose-fish":
    case "empty-hook":
    case "snag-lure": {
      return wasLoggedFromThisChallenge(log, template)
        ? pass()
        : fail("This challenge must be logged from the challenge card.");
    }

    // Adventure challenges
    case "new-location": {
      const currentLocationKey = getLocationKey(log);

      if (!currentLocationKey) {
        return fail("This log needs a location.");
      }

      const hasFishedHereBefore = previousLogs.some((oldLog) => {
        if (String(oldLog._id) === String(log._id)) return false;
        return getLocationKey(oldLog) === currentLocationKey;
      });

      if (hasFishedHereBefore) {
        return fail("This location has already been logged before.");
      }

      return pass();
    }

    case "early-catch": {
      if (!caughtFish) return fail("You need to catch a fish.");

      return log.timeOfDay === "morning"
        ? pass()
        : fail("This catch must be before sunrise.");
    }

    case "night-catch": {
      if (!caughtFish) return fail("You need to catch a fish.");

      return log.timeOfDay === "night"
        ? pass()
        : fail("This catch must be after sunset.");
    }

    case "rain-fisher": {
      if (!caughtFish) return fail("You need to catch a fish.");

      return ["rainy", "rain", "stormy"].includes(weather)
        ? pass()
        : fail("Weather must be rainy or stormy.");
    }

    // Different species challenge
    case "three-diff-species": {
      if (!caughtFish) return fail("You need to catch a fish.");
      return verifyDifferentSpecies(log, previousLogs, 3);
    }

    // Rig challenges
    case "use-live-bait": {
      if (!caughtFish) return fail("You need to catch a fish.");

      const liveBaitIds = [
        "live_worm",
        "worm",
        "nightcrawler",
        "minnow",
        "cricket",
      ];

      return liveBaitIds.includes(baitId)
        ? pass()
        : fail("You need to use live bait.");
    }

    case "use-worms": {
      if (!caughtFish) return fail("You need to catch a fish.");

      return ["live_worm", "worm", "nightcrawler"].includes(baitId)
        ? pass()
        : fail("You need to use a worm.");
    }

    case "use-crankbait": {
      if (!caughtFish) return fail("You need to catch a fish.");

      return baitId === "crankbait"
        ? pass()
        : fail("You need to use a crankbait.");
    }

    case "use-spinnerbait": {
      if (!caughtFish) return fail("You need to catch a fish.");

      return baitId === "spinnerbait"
        ? pass()
        : fail("You need to use a spinnerbait.");
    }

    case "use-bobber": {
      if (!caughtFish) return fail("You need to catch a fish.");

      return log.bobber === true ? pass() : fail("You need to use a bobber.");
    }

    case "use-texas-rig": {
      if (!caughtFish) return fail("You need to catch a fish.");

      const isEwgHook = hookId.includes("ewg") || hookId.includes("offset");

      const isBulletWeight = weightId.includes("bullet");

      return isEwgHook && isBulletWeight
        ? pass()
        : fail("You need to use a Texas rig.");
    }

    case "use-dropshot": {
      if (!caughtFish) return fail("You need to catch a fish.");

      const isDropshotWeight =
        weightId.includes("dropshot") ||
        weightId.includes("drop_shot") ||
        weightId.includes("drop-shot");

      return isDropshotWeight
        ? pass()
        : fail("You need to use a dropshot weight.");
    }

    case "use-topwater": {
      if (!caughtFish) return fail("You need to catch a fish.");

      const topwaterBaitIds = ["buzzbait", "topwater_frog", "popper"];

      return topwaterBaitIds.includes(baitId)
        ? pass()
        : fail("You need to use topwater bait.");
    }

    // Size challenges
    case "small-fish": {
      if (!caughtFish) return fail("You need to catch a fish.");

      const length = Number(log.length || 0);

      return length > 0 && length <= 6
        ? pass()
        : fail("Fish must be 6 inches or smaller.");
    }

    case "medium-fish": {
      if (!caughtFish) return fail("You need to catch a fish.");

      const length = Number(log.length || 0);

      return length >= 7 && length <= 15
        ? pass()
        : fail("Fish must be between 7 and 15 inches.");
    }

    case "trophy-fish": {
      if (!caughtFish) return fail("You need to catch a fish.");

      const length = Number(log.length || 0);
      const weight = Number(log.weight || 0);

      return length >= 20 || weight >= 5
        ? pass()
        : fail("Fish must be trophy sized.");
    }

    // Species/category challenges if you add daily species challenges later
    default: {
      if (template.type === "species_count") {
        return verifySpeciesChallenge(log, template);
      }

      if (template.type === "fish_count") {
        return verifyFishCountChallenge(
          log,
          template,
          previousLogs,
          userChallenge,
        );
      }

      return fail("This challenge cannot be automatically verified yet.");
    }
  }
}
function verifyFishCountChallenge(log, template, previousLogs, userChallenge) {
  if (log.skunked || !log.speciesId) {
    return fail("You need to catch a fish.");
  }

  const startTime = new Date(userChallenge.assignedAt);

  const relevantLogs = previousLogs.filter((oldLog) => {
    if (oldLog.skunked || !oldLog.speciesId) return false;

    const logTime = new Date(oldLog.createdAt || oldLog.date);
    return logTime >= startTime;
  });

  const totalFish = relevantLogs.length + 1;

  return {
    passed: totalFish >= (template.goal || 1),
    progress: totalFish,
    reason:
      totalFish >= (template.goal || 1)
        ? undefined
        : `You need ${template.goal} fish. (${totalFish}/${template.goal})`,
  };
}
function verifySpeciesChallenge(log, template) {
  if (log.skunked || !log.speciesId) {
    return fail("You need to catch a fish.");
  }

  const fishKey = String(template.fishKey || "").toLowerCase();

  if (!fishKey) {
    return pass();
  }

  const speciesId = String(log.speciesId || "").toLowerCase();
  const speciesName = String(log.speciesName || "").toLowerCase();

  const speciesConfig = AllSpecies.find(
    (fish) => String(fish.id).toLowerCase() === speciesId,
  );

  const configName = String(speciesConfig?.name || "").toLowerCase();
  const configGroup = String(speciesConfig?.group || "").toLowerCase();
  const configCategory = String(speciesConfig?.category || "").toLowerCase();

  if (
    speciesId === fishKey ||
    speciesName === fishKey ||
    configName === fishKey ||
    configGroup === fishKey ||
    configCategory === fishKey
  ) {
    return pass();
  }

  return fail(`This challenge requires ${template.fishKey}.`);
}

function verifyDifferentSpecies(log, previousLogs, goal) {
  const speciesSet = new Set();

  for (const oldLog of previousLogs) {
    if (!oldLog.skunked && oldLog.speciesId) {
      speciesSet.add(String(oldLog.speciesId).toLowerCase());
    }
  }

  speciesSet.add(String(log.speciesId).toLowerCase());

  return speciesSet.size >= goal
    ? pass()
    : fail(`You need ${goal} different species.`);
}

function wasLoggedFromThisChallenge(log, template) {
  const templateKey = template.id || template.templateKey;

  return log.challenge?.templateKey === templateKey;
}

function getLocationKey(log) {
  const parts = [log.address, log.city, log.state]
    .filter(Boolean)
    .map((part) => String(part).trim().toLowerCase());

  return parts.join("|");
}

function pass() {
  return { passed: true };
}

function fail(reason) {
  return { passed: false, reason };
}
