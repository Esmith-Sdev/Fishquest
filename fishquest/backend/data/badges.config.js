const TIERS = {
  AMATEUR: 10,
  PRO: 25,
  MASTER: 100,
};

const createTieredBadges = (key, label, type) => [
  {
    id: `${key}_amateur`,
    name: `${label} Amateur`,
    requirement: {
      type,
      value: TIERS.AMATEUR,
    },
  },
  {
    id: `${key}_pro`,
    name: `${label} Pro`,
    requirement: {
      type,
      value: TIERS.PRO,
    },
  },
  {
    id: `${key}_master`,
    name: `${label} Master`,
    requirement: {
      type,
      value: TIERS.MASTER,
    },
  },
];

export const BADGES = [
  {
    id: "first_catch",
    name: "First Catch",
    requirement: {
      type: "total_catches",
      value: 1,
    },
  },

  ...createTieredBadges("baitcaster", "Baitcaster", "baitcaster_count"),

  ...createTieredBadges("bluegill", "Bluegill", "bluegill_count"),

  ...createTieredBadges("bobber", "Bobber", "bobber_count"),

  ...createTieredBadges("bottom", "Bottom", "bottom_count"),

  ...createTieredBadges("buddy", "Buddy", "buddy_count"),

  ...createTieredBadges("button", "Button", "button_count"),

  ...createTieredBadges("buzzbait", "Buzzbait", "buzzbait_count"),

  ...createTieredBadges("catfish", "Catfish", "catfish_count"),

  ...createTieredBadges("crankbait", "Crankbait", "crankbait_count"),

  ...createTieredBadges("crappie", "Crappie", "crappie_count"),

  ...createTieredBadges("crawfish", "Crawfish", "crawfish_count"),

  ...createTieredBadges("day", "Day", "day_count"),

  ...createTieredBadges("explorer", "Explorer", "explorer_count"),

  ...createTieredBadges("finesse", "Finesse", "finesse_count"),

  ...createTieredBadges("fly", "Fly", "fly_count"),

  ...createTieredBadges("frog", "Frog", "frog_count"),

  ...createTieredBadges("grub", "Grub", "grub_count"),

  ...createTieredBadges(
    "largemouth_bass",
    "Largemouth Bass",
    "largemouth_bass_count",
  ),

  ...createTieredBadges("live_worm", "Live Worm", "live_worm_count"),

  ...createTieredBadges("minnow", "Minnow", "minnow_count"),

  ...createTieredBadges("morning", "Morning", "morning_count"),

  ...createTieredBadges("night", "Night", "night_count"),

  ...createTieredBadges(
    "other_plastic",
    "Other Plastic",
    "other_plastic_count",
  ),

  ...createTieredBadges("pike", "Pike", "pike_count"),

  ...createTieredBadges("plastic_worm", "Plastic Worm", "plastic_worm_count"),

  ...createTieredBadges("plopper", "Plopper", "plopper_count"),

  ...createTieredBadges("rare", "Rare", "rare_count"),

  ...createTieredBadges("rig", "Rig", "rig_count"),

  ...createTieredBadges("rooster_tail", "Rooster Tail", "rooster_tail_count"),

  ...createTieredBadges("skunked", "Skunked", "skunked_count"),

  ...createTieredBadges(
    "smallmouth_bass",
    "Smallmouth Bass",
    "smallmouth_bass_count",
  ),

  ...createTieredBadges("spinnerbait", "Spinnerbait", "spinnerbait_count"),

  ...createTieredBadges("spinning", "Spinning", "spinning_count"),

  ...createTieredBadges("spoon", "Spoon", "spoon_count"),

  ...createTieredBadges("storm", "Storm", "storm_count"),

  ...createTieredBadges("sunfish", "Sunfish", "sunfish_count"),

  ...createTieredBadges("topwater", "Topwater", "topwater_count"),

  ...createTieredBadges("trout", "Trout", "trout_count"),

  ...createTieredBadges("tube", "Tube", "tube_count"),

  ...createTieredBadges("walleye", "Walleye", "walleye_count"),
];
