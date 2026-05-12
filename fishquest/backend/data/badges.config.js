const TIERS = {
  AMATEUR: 10,
  PRO: 25,
  MASTER: 100,
};

export const BADGES = [
  {
    id: "first_catch",
    name: "First Catch",
    requirement: { type: "total_catches", value: 1 },
  },

  {
    id: "baitcaster_amateur",
    name: "Baitcaster Amateur",
    requirement: {
      type: "baitcaster_count",
      value: TIERS.AMATEUR,
    },
  },
  {
    id: "baitcaster_pro",
    name: "Baitcaster Pro",
    requirement: {
      type: "baitcaster_count",
      value: TIERS.PRO,
    },
  },
  {
    id: "baitcaster_master",
    name: "Baitcaster Master",
    requirement: {
      type: "baitcaster_count",
      value: TIERS.MASTER,
    },
  },

  {
    id: "bluegill_amateur",
    name: "Bluegill Amateur",
    requirement: {
      type: "bluegill_count",
      value: TIERS.AMATEUR,
    },
  },

  // etc...
];
