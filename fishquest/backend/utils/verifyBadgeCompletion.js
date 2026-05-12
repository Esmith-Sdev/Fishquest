// utils/verifyBadgeCompletion.js
import { fishSpeciesMap } from "../data/species.config.js";

const RARE_POPULARITIES = ["rare", "specialty"];

export function verifyBadgeCompletion(badge, logs = []) {
  const requirement = badge?.requirement;

  if (!requirement?.type) {
    return {
      passed: false,
      progress: 0,
      goal: 1,
      reason: "Badge is missing a requirement type.",
    };
  }

  const goal = requirement.value || 1;
  const progress = getBadgeProgress(requirement.type, logs);

  return {
    passed: progress >= goal,
    progress,
    goal,
    reason: progress >= goal ? undefined : `Progress: ${progress}/${goal}`,
  };
}

export function getBadgeProgress(type, logs = []) {
  const validLogs = getUniqueLogs(logs);

  switch (type) {
    case "total_catches":
      return validLogs.filter(isCaughtFish).length;

    case "skunked_count":
      return validLogs.filter((log) => log.skunked === true).length;

    case "bobber_count":
      return validLogs.filter((log) => isCaughtFish(log) && log.bobber === true)
        .length;

    case "bottom_count":
      return validLogs.filter((log) => isCaughtFish(log) && hasWeight(log))
        .length;

    case "rig_count":
      return validLogs.filter((log) => !!log.rigPresetId).length;

    case "morning_count":
      return validLogs.filter(
        (log) => isCaughtFish(log) && normalize(log.timeOfDay) === "morning",
      ).length;

    case "day_count":
      return validLogs.filter(
        (log) => isCaughtFish(log) && normalize(log.timeOfDay) === "day",
      ).length;

    case "night_count":
      return validLogs.filter(
        (log) => isCaughtFish(log) && normalize(log.timeOfDay) === "night",
      ).length;

    case "storm_count":
      return validLogs.filter(
        (log) =>
          isCaughtFish(log) &&
          ["storm", "stormy", "rainy", "rain"].includes(normalize(log.weather)),
      ).length;

    case "explorer_count":
      return countUniqueLocations(validLogs);

    case "rare_count":
      return validLogs.filter((log) => {
        if (!isCaughtFish(log)) return false;

        const species = fishSpeciesMap[log.speciesId];
        return (
          species && RARE_POPULARITIES.includes(normalize(species.popularity))
        );
      }).length;

    case "baitcaster_count":
    case "spinning_count":
    case "button_count":
    case "fly_count":
      return validLogs.filter(
        (log) =>
          isCaughtFish(log) &&
          normalize(log.method) === type.replace("_count", ""),
      ).length;

    case "bluegill_count":
    case "catfish_count":
    case "crappie_count":
    case "largemouth_bass_count":
    case "pike_count":
    case "smallmouth_bass_count":
    case "sunfish_count":
    case "trout_count":
    case "walleye_count":
      return validLogs.filter(
        (log) => isCaughtFish(log) && matchesSpecies(log, type),
      ).length;

    case "buzzbait_count":
    case "crankbait_count":
    case "crawfish_count":
    case "finesse_count":
    case "frog_count":
    case "grub_count":
    case "live_worm_count":
    case "minnow_count":
    case "other_plastic_count":
    case "plastic_worm_count":
    case "plopper_count":
    case "rooster_tail_count":
    case "spinnerbait_count":
    case "spoon_count":
    case "topwater_count":
    case "tube_count":
      return validLogs.filter(
        (log) => isCaughtFish(log) && matchesBait(log, type),
      ).length;

    case "buddy_count":
      return 0;

    default:
      return 0;
  }
}

function isCaughtFish(log) {
  return !log.skunked && !!log.speciesId;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
}

function getUniqueLogs(logs) {
  const map = new Map();

  logs.forEach((log, index) => {
    const key = String(log._id || log.id || index);
    map.set(key, log);
  });

  return Array.from(map.values());
}

function matchesSpecies(log, type) {
  const target = type.replace("_count", "");
  const speciesId = normalize(log.speciesId);
  const speciesName = normalize(log.speciesName);

  return speciesId.includes(target) || speciesName.includes(target);
}

function matchesBait(log, type) {
  const target = type.replace("_count", "");
  const baitId = normalize(log.baitId);
  const baitName = normalize(log.baitName);

  const groups = {
    live_worm: ["live_worm", "worm", "nightcrawler"],
    plastic_worm: ["plastic_worm", "senko", "soft_plastic_worm"],
    topwater: ["topwater", "frog", "buzzbait", "plopper", "popper"],
    other_plastic: ["other_plastic", "soft_plastic"],
    rooster_tail: ["rooster_tail", "inline_spinner"],
    plopper: ["plopper", "whopper_plopper"],
    crawfish: ["crawfish", "craw", "creature_bait"],
  };

  const acceptedValues = groups[target] || [target];

  return acceptedValues.some(
    (value) => baitId.includes(value) || baitName.includes(value),
  );
}

function hasWeight(log) {
  return !!log.weightId;
}

function countUniqueLocations(logs) {
  const locationSet = new Set();

  logs.forEach((log) => {
    const key = [log.address, log.city, log.state]
      .filter(Boolean)
      .map(normalize)
      .join("|");

    if (key) locationSet.add(key);
  });

  return locationSet.size;
}
