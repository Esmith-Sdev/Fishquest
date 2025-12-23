const TIERS = {
  AMATEUR: 10,
  PRO: 25,
  MASTER: 100,
};

export const BADGES = [
  // FIRST CATCH
  {
    id: "first_catch",
    name: "First Catch",
    icon: "/badges/Badge1st-Catch.png",
    requirement: { type: "total_catches", value: 1 },
  },

  // BAITCASTER
  {
    id: "baitcaster_amateur",
    name: "Baitcaster Amateur",
    icon: "/badges/BadgeBAITCASTER-AMATEUR.png",
    requirement: { type: "baitcaster_count", value: TIERS.AMATEUR },
  },
  {
    id: "baitcaster_pro",
    name: "Baitcaster Pro",
    icon: "/badges/BadgeBAITCASTER-PRO.png",
    requirement: { type: "baitcaster_count", value: TIERS.PRO },
  },
  {
    id: "baitcaster_master",
    name: "Baitcaster Master",
    icon: "/badges/BadgeBAITCASTER-MASTER.png",
    requirement: { type: "baitcaster_count", value: TIERS.MASTER },
  },

  // BLUEGILL
  {
    id: "bluegill_amateur",
    name: "Bluegill Amateur",
    icon: "/badges/Badgebluegill-AMATEUR.png",
    requirement: { type: "bluegill_count", value: TIERS.AMATEUR },
  },
  {
    id: "bluegill_pro",
    name: "Bluegill Pro",
    icon: "/badges/Badgebluegill-PRO.png",
    requirement: { type: "bluegill_count", value: TIERS.PRO },
  },
  {
    id: "bluegill_master",
    name: "Bluegill Master",
    icon: "/badges/Badgebluegill-MASTER.png",
    requirement: { type: "bluegill_count", value: TIERS.MASTER },
  },

  // BOBBER
  {
    id: "bobber_amateur",
    name: "Bobber Amateur",
    icon: "/badges/BadgeBOBBER-AMATEUR.png",
    requirement: { type: "bobber_count", value: TIERS.AMATEUR },
  },
  {
    id: "bobber_pro",
    name: "Bobber Pro",
    icon: "/badges/BadgeBOBBER-pro.png",
    requirement: { type: "bobber_count", value: TIERS.PRO },
  },
  {
    id: "bobber_master",
    name: "Bobber Master",
    icon: "/badges/BadgeBOBBER-master.png",
    requirement: { type: "bobber_count", value: TIERS.MASTER },
  },

  // BOTTOM
  {
    id: "bottom_amateur",
    name: "Bottom Amateur",
    icon: "/badges/BadgeBOTTOM-AMATEUR.png",
    requirement: { type: "bottom_count", value: TIERS.AMATEUR },
  },
  {
    id: "bottom_pro",
    name: "Bottom Pro",
    icon: "/badges/BadgeBOTTOM-PRO.png",
    requirement: { type: "bottom_count", value: TIERS.PRO },
  },
  {
    id: "bottom_master",
    name: "Bottom Master",
    icon: "/badges/BadgeBOTTOM-MASTER.png",
    requirement: { type: "bottom_count", value: TIERS.MASTER },
  },

  // BOTTOM FISHING
  {
    id: "bottom_fishing_amateur",
    name: "Bottom Fishing Amateur",
    icon: "/badges/BadgeBOTTOM-FISHING-AMATEUR.png",
    requirement: { type: "bottom_fishing_count", value: TIERS.AMATEUR },
  },

  // BUDDY
  {
    id: "buddy_amateur",
    name: "Buddy Amateur",
    icon: "/badges/BadgeBUDDY-AMATEUR.png",
    requirement: { type: "buddy_count", value: TIERS.AMATEUR },
  },
  {
    id: "buddy_pro",
    name: "Buddy Pro",
    icon: "/badges/BadgeBUDDY-PRO.png",
    requirement: { type: "buddy_count", value: TIERS.PRO },
  },
  {
    id: "buddy_master",
    name: "Buddy Master",
    icon: "/badges/BadgeBUDDY-MASTER.png",
    requirement: { type: "buddy_count", value: TIERS.MASTER },
  },

  // BUTTON
  {
    id: "button_amateur",
    name: "Button Amateur",
    icon: "/badges/BadgeBUTTON-AMATEUR.png",
    requirement: { type: "button_count", value: TIERS.AMATEUR },
  },
  {
    id: "button_pro",
    name: "Button Pro",
    icon: "/badges/BadgeBUTTON-PRO.png",
    requirement: { type: "button_count", value: TIERS.PRO },
  },
  {
    id: "button_master",
    name: "Button Master",
    icon: "/badges/BadgeBUTTON-MASTER.png",
    requirement: { type: "button_count", value: TIERS.MASTER },
  },

  // BUZZBAIT
  {
    id: "buzzbait_amateur",
    name: "Buzzbait Amateur",
    icon: "/badges/BadgeBUZZBAIT-AMATEUR.png",
    requirement: { type: "buzzbait_count", value: TIERS.AMATEUR },
  },
  {
    id: "buzzbait_pro",
    name: "Buzzbait Pro",
    icon: "/badges/BadgeBUZZBAIT-pro.png",
    requirement: { type: "buzzbait_count", value: TIERS.PRO },
  },
  {
    id: "buzzbait_master",
    name: "Buzzbait Master",
    icon: "/badges/BadgeBUZZBAIT-master.png",
    requirement: { type: "buzzbait_count", value: TIERS.MASTER },
  },

  // CATFISH
  {
    id: "catfish_amateur",
    name: "Catfish Amateur",
    icon: "/badges/BadgeCatfish-AMATEUR.png",
    requirement: { type: "catfish_count", value: TIERS.AMATEUR },
  },
  {
    id: "catfish_pro",
    name: "Catfish Pro",
    icon: "/badges/BadgeCatfish-PRO.png",
    requirement: { type: "catfish_count", value: TIERS.PRO },
  },
  {
    id: "catfish_master",
    name: "Catfish Master",
    icon: "/badges/BadgeCatfish-MASTER.png",
    requirement: { type: "catfish_count", value: TIERS.MASTER },
  },

  // CRANKBAIT
  {
    id: "crankbait_amateur",
    name: "Crankbait Amateur",
    icon: "/badges/BadgeCRANKBAIT-AMATEUR.png",
    requirement: { type: "crankbait_count", value: TIERS.AMATEUR },
  },
  {
    id: "crankbait_pro",
    name: "Crankbait Pro",
    icon: "/badges/BadgeCRANKBAIT-pro.png",
    requirement: { type: "crankbait_count", value: TIERS.PRO },
  },
  {
    id: "crankbait_master",
    name: "Crankbait Master",
    icon: "/badges/BadgeCRANKBAIT-master.png",
    requirement: { type: "crankbait_count", value: TIERS.MASTER },
  },

  // CRAPPIE
  {
    id: "crappie_amateur",
    name: "Crappie Amateur",
    icon: "/badges/BadgeCRAPPIE-AMATEUR.png",
    requirement: { type: "crappie_count", value: TIERS.AMATEUR },
  },
  {
    id: "crappie_pro",
    name: "Crappie Pro",
    icon: "/badges/BadgeCRAPPIE-PRO.png",
    requirement: { type: "crappie_count", value: TIERS.PRO },
  },
  {
    id: "crappie_master",
    name: "Crappie Master",
    icon: "/badges/BadgeCRAPPIE-MASTER.png",
    requirement: { type: "crappie_count", value: TIERS.MASTER },
  },

  // CRAWFISH
  {
    id: "crawfish_amateur",
    name: "Crawfish Amateur",
    icon: "/badges/BadgeCRAWFISH-AMATEUR.png",
    requirement: { type: "crawfish_count", value: TIERS.AMATEUR },
  },
  {
    id: "crawfish_pro",
    name: "Crawfish Pro",
    icon: "/badges/BadgeCRAWFISH-PRO.png",
    requirement: { type: "crawfish_count", value: TIERS.PRO },
  },
  {
    id: "crawfish_master",
    name: "Crawfish Master",
    icon: "/badges/BadgeCRAWFISH-MASTER.png",
    requirement: { type: "crawfish_count", value: TIERS.MASTER },
  },

  // DAY
  {
    id: "day_amateur",
    name: "Day Amateur",
    icon: "/badges/BadgeDAY-AMATEUR.png",
    requirement: { type: "day_count", value: TIERS.AMATEUR },
  },
  {
    id: "day_pro",
    name: "Day Pro",
    icon: "/badges/BadgeDAY-PRO.png",
    requirement: { type: "day_count", value: TIERS.PRO },
  },
  {
    id: "day_master",
    name: "Day Master",
    icon: "/badges/BadgeDAY-MASTER.png",
    requirement: { type: "day_count", value: TIERS.MASTER },
  },

  // EXPLORER
  {
    id: "explorer_amateur",
    name: "Explorer Amateur",
    icon: "/badges/BadgeEXPLORER-AMATEUR.png",
    requirement: { type: "explorer_count", value: TIERS.AMATEUR },
  },
  {
    id: "explorer_pro",
    name: "Explorer Pro",
    icon: "/badges/BadgeEXPLORER-PRO.png",
    requirement: { type: "explorer_count", value: TIERS.PRO },
  },
  {
    id: "explorer_master",
    name: "Explorer Master",
    icon: "/badges/BadgeEXPLORER-MASTER.png",
    requirement: { type: "explorer_count", value: TIERS.MASTER },
  },

  // FINESSE
  {
    id: "finesse_amateur",
    name: "Finesse Amateur",
    icon: "/badges/BadgeFINESSE-AMATEUR.png",
    requirement: { type: "finesse_count", value: TIERS.AMATEUR },
  },
  {
    id: "finesse_pro",
    name: "Finesse Pro",
    icon: "/badges/BadgeFINESSE-PRO.png",
    requirement: { type: "finesse_count", value: TIERS.PRO },
  },
  {
    id: "finesse_master",
    name: "Finesse Master",
    icon: "/badges/BadgeFINESSE-MASTER.png",
    requirement: { type: "finesse_count", value: TIERS.MASTER },
  },

  // FLY
  {
    id: "fly_amateur",
    name: "Fly Amateur",
    icon: "/badges/BadgeFLY-AMATEUR.png",
    requirement: { type: "fly_count", value: TIERS.AMATEUR },
  },
  {
    id: "fly_pro",
    name: "Fly Pro",
    icon: "/badges/BadgeFLY-PRO.png",
    requirement: { type: "fly_count", value: TIERS.PRO },
  },
  {
    id: "fly_master",
    name: "Fly Master",
    icon: "/badges/BadgeFLY-MASTER.png",
    requirement: { type: "fly_count", value: TIERS.MASTER },
  },

  // FROG
  {
    id: "frog_amateur",
    name: "Frog Amateur",
    icon: "/badges/BadgeFROG-AMATEUR.png",
    requirement: { type: "frog_count", value: TIERS.AMATEUR },
  },
  {
    id: "frog_pro",
    name: "Frog Pro",
    icon: "/badges/BadgeFROG-PRO.png",
    requirement: { type: "frog_count", value: TIERS.PRO },
  },
  {
    id: "frog_master",
    name: "Frog Master",
    icon: "/badges/BadgeFROG-MASTER.png",
    requirement: { type: "frog_count", value: TIERS.MASTER },
  },

  // GRUB
  {
    id: "grub_amateur",
    name: "Grub Amateur",
    icon: "/badges/BadgeGRUB-AMATEUR.png",
    requirement: { type: "grub_count", value: TIERS.AMATEUR },
  },
  {
    id: "grub_pro",
    name: "Grub Pro",
    icon: "/badges/BadgeGRUB-PRO.png",
    requirement: { type: "grub_count", value: TIERS.PRO },
  },
  {
    id: "grub_master",
    name: "Grub Master",
    icon: "/badges/BadgeGRUB-MASTER.png",
    requirement: { type: "grub_count", value: TIERS.MASTER },
  },

  // LARGEMOUTH BASS
  {
    id: "largemouth_bass_amateur",
    name: "Largemouth Bass Amateur",
    icon: "/badges/BadgeLARGEMOUTH-BASS-AMATEUR.png",
    requirement: { type: "largemouth_bass_count", value: TIERS.AMATEUR },
  },
  {
    id: "largemouth_bass_pro",
    name: "Largemouth Bass Pro",
    icon: "/badges/BadgeLARGEMOUTH-BASS-PRO.png",
    requirement: { type: "largemouth_bass_count", value: TIERS.PRO },
  },
  {
    id: "largemouth_bass_master",
    name: "Largemouth Bass Master",
    icon: "/badges/BadgeLARGEMOUTH-BASS-MASTER.png",
    requirement: { type: "largemouth_bass_count", value: TIERS.MASTER },
  },

  // LIVE WORM
  {
    id: "live_worm_amateur",
    name: "Live Worm Amateur",
    icon: "/badges/BadgeLIVE-WORM-AMATEUR.png",
    requirement: { type: "live_worm_count", value: TIERS.AMATEUR },
  },
  {
    id: "live_worm_pro",
    name: "Live Worm Pro",
    icon: "/badges/BadgeLIVE-WORM-PRO.png",
    requirement: { type: "live_worm_count", value: TIERS.PRO },
  },
  {
    id: "live_worm_master",
    name: "Live Worm Master",
    icon: "/badges/BadgeLIVE-WORM-MASTER.png",
    requirement: { type: "live_worm_count", value: TIERS.MASTER },
  },

  // MINNOW
  {
    id: "minnow_amateur",
    name: "Minnow Amateur",
    icon: "/badges/BadgeMINNOW-AMATEUR.png",
    requirement: { type: "minnow_count", value: TIERS.AMATEUR },
  },
  {
    id: "minnow_pro",
    name: "Minnow Pro",
    icon: "/badges/BadgeMINNOW-PRO.png",
    requirement: { type: "minnow_count", value: TIERS.PRO },
  },
  {
    id: "minnow_master",
    name: "Minnow Master",
    icon: "/badges/BadgeMINNOW-MASTER.png",
    requirement: { type: "minnow_count", value: TIERS.MASTER },
  },

  // MORNING
  {
    id: "morning_amateur",
    name: "Morning Amateur",
    icon: "/badges/BadgeMORNING-AMATEUR.png",
    requirement: { type: "morning_count", value: TIERS.AMATEUR },
  },
  {
    id: "morning_pro",
    name: "Morning Pro",
    icon: "/badges/BadgeMORNING-PRO.png",
    requirement: { type: "morning_count", value: TIERS.PRO },
  },
  {
    id: "morning_master",
    name: "Morning Master",
    icon: "/badges/BadgeMORNING-MASTER.png",
    requirement: { type: "morning_count", value: TIERS.MASTER },
  },

  // NIGHT
  {
    id: "night_amateur",
    name: "Night Amateur",
    icon: "/badges/BadgeNIGHT-AMATEUR.png",
    requirement: { type: "night_count", value: TIERS.AMATEUR },
  },
  {
    id: "night_pro",
    name: "Night Pro",
    icon: "/badges/BadgeNIGHT-PRO.png",
    requirement: { type: "night_count", value: TIERS.PRO },
  },
  {
    id: "night_master",
    name: "Night Master",
    icon: "/badges/BadgeNIGHT-MASTER.png",
    requirement: { type: "night_count", value: TIERS.MASTER },
  },

  // OTHER PLASTIC
  {
    id: "other_plastic_amateur",
    name: "Other Plastic Amateur",
    icon: "/badges/BadgeOther-Plastic-AMATEUR.png",
    requirement: { type: "other_plastic_count", value: TIERS.AMATEUR },
  },
  {
    id: "other_plastic_pro",
    name: "Other Plastic Pro",
    icon: "/badges/BadgeOther-Plastic-Pro.png",
    requirement: { type: "other_plastic_count", value: TIERS.PRO },
  },
  {
    id: "other_plastic_master",
    name: "Other Plastic Master",
    icon: "/badges/BadgeOther-Plastic-Master.png",
    requirement: { type: "other_plastic_count", value: TIERS.MASTER },
  },

  // PIKE
  {
    id: "pike_amateur",
    name: "Pike Amateur",
    icon: "/badges/BadgePIKE-AMATEUR.png",
    requirement: { type: "pike_count", value: TIERS.AMATEUR },
  },
  {
    id: "pike_pro",
    name: "Pike Pro",
    icon: "/badges/BadgePIKE-PRO.png",
    requirement: { type: "pike_count", value: TIERS.PRO },
  },
  {
    id: "pike_master",
    name: "Pike Master",
    icon: "/badges/BadgePIKE-MASTER.png",
    requirement: { type: "pike_count", value: TIERS.MASTER },
  },

  // PLASTIC WORM
  {
    id: "plastic_worm_amateur",
    name: "Plastic Worm Amateur",
    icon: "/badges/BadgePLASTIC-WORM-AMATEUR.png",
    requirement: { type: "plastic_worm_count", value: TIERS.AMATEUR },
  },
  {
    id: "plastic_worm_pro",
    name: "Plastic Worm Pro",
    icon: "/badges/BadgePLASTIC-WORM-PRO.png",
    requirement: { type: "plastic_worm_count", value: TIERS.PRO },
  },
  {
    id: "plastic_worm_master",
    name: "Plastic Worm Master",
    icon: "/badges/BadgePLASTIC-WORM-MASTER.png",
    requirement: { type: "plastic_worm_count", value: TIERS.MASTER },
  },

  // PLOPPER
  {
    id: "plopper_amateur",
    name: "Plopper Amateur",
    icon: "/badges/BadgePLOPPER-AMATEUR.png",
    requirement: { type: "plopper_count", value: TIERS.AMATEUR },
  },
  {
    id: "plopper_pro",
    name: "Plopper Pro",
    icon: "/badges/BadgePLOPPER-PRO.png",
    requirement: { type: "plopper_count", value: TIERS.PRO },
  },
  {
    id: "plopper_master",
    name: "Plopper Master",
    icon: "/badges/BadgePLOPPER-MASTER.png",
    requirement: { type: "plopper_count", value: TIERS.MASTER },
  },

  // RARE
  {
    id: "rare_amateur",
    name: "Rare Amateur",
    icon: "/badges/BadgeRARE-AMATEUR.png",
    requirement: { type: "rare_count", value: TIERS.AMATEUR },
  },
  {
    id: "rare_pro",
    name: "Rare Pro",
    icon: "/badges/BadgeRARE-PRO.png",
    requirement: { type: "rare_count", value: TIERS.PRO },
  },
  {
    id: "rare_master",
    name: "Rare Master",
    icon: "/badges/BadgeRARE-MASTER.png",
    requirement: { type: "rare_count", value: TIERS.MASTER },
  },

  // RIG
  {
    id: "rig_amateur",
    name: "Rig Amateur",
    icon: "/badges/Badgerig-AMATEUR.png",
    requirement: { type: "rig_count", value: TIERS.AMATEUR },
  },
  {
    id: "rig_pro",
    name: "Rig Pro",
    icon: "/badges/Badgerig-PRO.png",
    requirement: { type: "rig_count", value: TIERS.PRO },
  },
  {
    id: "rig_master",
    name: "Rig Master",
    icon: "/badges/Badgerig-MASTER.png",
    requirement: { type: "rig_count", value: TIERS.MASTER },
  },

  // ROOSTER TAIL
  {
    id: "rooster_tail_amateur",
    name: "Rooster Tail Amateur",
    icon: "/badges/BadgeROOSTER-TAIL-AMATEUR.png",
    requirement: { type: "rooster_tail_count", value: TIERS.AMATEUR },
  },
  {
    id: "rooster_tail_pro",
    name: "Rooster Tail Pro",
    icon: "/badges/BadgeROOSTER-TAIL-PRO.png",
    requirement: { type: "rooster_tail_count", value: TIERS.PRO },
  },
  {
    id: "rooster_tail_master",
    name: "Rooster Tail Master",
    icon: "/badges/BadgeROOSTER-TAIL-MASTER.png",
    requirement: { type: "rooster_tail_count", value: TIERS.MASTER },
  },

  // SKUNKED
  {
    id: "skunked_amateur",
    name: "Skunked Amateur",
    icon: "/badges/BadgeSKUNKED-AMATEUR.png",
    requirement: { type: "skunked_count", value: TIERS.AMATEUR },
  },
  {
    id: "skunked_pro",
    name: "Skunked Pro",
    icon: "/badges/BadgeSKUNKED-PRO.png",
    requirement: { type: "skunked_count", value: TIERS.PRO },
  },
  {
    id: "skunked_master",
    name: "Skunked Master",
    icon: "/badges/BadgeSKUNKED-MASTER.png",
    requirement: { type: "skunked_count", value: TIERS.MASTER },
  },

  // SMALLMOUTH BASS (note: MASTER file has double dash in filename)
  {
    id: "smallmouth_bass_amateur",
    name: "Smallmouth Bass Amateur",
    icon: "/badges/BadgeSMALLMOUTH-BASS-AMATEUR.png",
    requirement: { type: "smallmouth_bass_count", value: TIERS.AMATEUR },
  },
  {
    id: "smallmouth_bass_pro",
    name: "Smallmouth Bass Pro",
    icon: "/badges/BadgeSMALLMOUTH-BASS-PRO.png",
    requirement: { type: "smallmouth_bass_count", value: TIERS.PRO },
  },
  {
    id: "smallmouth_bass_master",
    name: "Smallmouth Bass Master",
    icon: "/badges/BadgeSMALLMOUTH-BASS--MASTER.png",
    requirement: { type: "smallmouth_bass_count", value: TIERS.MASTER },
  },

  // SPINNERBAIT
  {
    id: "spinnerbait_amateur",
    name: "Spinnerbait Amateur",
    icon: "/badges/BadgeSPINNERBAIT-AMATEUR.png",
    requirement: { type: "spinnerbait_count", value: TIERS.AMATEUR },
  },
  {
    id: "spinnerbait_pro",
    name: "Spinnerbait Pro",
    icon: "/badges/BadgeSPINNERBAIT-PRO.png",
    requirement: { type: "spinnerbait_count", value: TIERS.PRO },
  },
  {
    id: "spinnerbait_master",
    name: "Spinnerbait Master",
    icon: "/badges/BadgeSPINNERBAIT-MASTER.png",
    requirement: { type: "spinnerbait_count", value: TIERS.MASTER },
  },

  // SPINNING
  {
    id: "spinning_amateur",
    name: "Spinning Amateur",
    icon: "/badges/BadgeSPINNING-AMATEUR.png",
    requirement: { type: "spinning_count", value: TIERS.AMATEUR },
  },
  {
    id: "spinning_pro",
    name: "Spinning Pro",
    icon: "/badges/BadgeSPINNING-PRO.png",
    requirement: { type: "spinning_count", value: TIERS.PRO },
  },
  {
    id: "spinning_master",
    name: "Spinning Master",
    icon: "/badges/BadgeSPINNING-MASTER.png",
    requirement: { type: "spinning_count", value: TIERS.MASTER },
  },

  // SPOON
  {
    id: "spoon_amateur",
    name: "Spoon Amateur",
    icon: "/badges/BadgeSPOON-AMATEUR.png",
    requirement: { type: "spoon_count", value: TIERS.AMATEUR },
  },
  {
    id: "spoon_pro",
    name: "Spoon Pro",
    icon: "/badges/BadgeSPOON-PRO.png",
    requirement: { type: "spoon_count", value: TIERS.PRO },
  },
  {
    id: "spoon_master",
    name: "Spoon Master",
    icon: "/badges/BadgeSPOON-MASTER.png",
    requirement: { type: "spoon_count", value: TIERS.MASTER },
  },

  // STORM
  {
    id: "storm_amateur",
    name: "Storm Amateur",
    icon: "/badges/BadgeSTORM-AMATEUR.png",
    requirement: { type: "storm_count", value: TIERS.AMATEUR },
  },
  {
    id: "storm_pro",
    name: "Storm Pro",
    icon: "/badges/BadgeSTORM-PRO.png",
    requirement: { type: "storm_count", value: TIERS.PRO },
  },
  {
    id: "storm_master",
    name: "Storm Master",
    icon: "/badges/BadgeSTORM-MASTER.png",
    requirement: { type: "storm_count", value: TIERS.MASTER },
  },

  // SUNFISH
  {
    id: "sunfish_amateur",
    name: "Sunfish Amateur",
    icon: "/badges/BadgeSUNFISH-AMATEUR.png",
    requirement: { type: "sunfish_count", value: TIERS.AMATEUR },
  },
  {
    id: "sunfish_pro",
    name: "Sunfish Pro",
    icon: "/badges/BadgeSUNFISH-PRO.png",
    requirement: { type: "sunfish_count", value: TIERS.PRO },
  },
  {
    id: "sunfish_master",
    name: "Sunfish Master",
    icon: "/badges/BadgeSUNFISH-MASTER.png",
    requirement: { type: "sunfish_count", value: TIERS.MASTER },
  },

  // TARGET
  {
    id: "target_amateur",
    name: "Target Amateur",
    icon: "/badges/BadgeTARGET-AMATEUR.png",
    requirement: { type: "target_count", value: TIERS.AMATEUR },
  },
  {
    id: "target_pro",
    name: "Target Pro",
    icon: "/badges/BadgeTARGET-PRO.png",
    requirement: { type: "target_count", value: TIERS.PRO },
  },
  {
    id: "target_master",
    name: "Target Master",
    icon: "/badges/BadgeTARGET-MASTER.png",
    requirement: { type: "target_count", value: TIERS.MASTER },
  },

  // TOPWATER
  {
    id: "topwater_amateur",
    name: "Topwater Amateur",
    icon: "/badges/BadgeTOPWATER-AMATEUR.png",
    requirement: { type: "topwater_count", value: TIERS.AMATEUR },
  },
  {
    id: "topwater_pro",
    name: "Topwater Pro",
    icon: "/badges/BadgeTOPWATER-PRO.png",
    requirement: { type: "topwater_count", value: TIERS.PRO },
  },
  {
    id: "topwater_master",
    name: "Topwater Master",
    icon: "/badges/BadgeTOPWATER-MASTER.png",
    requirement: { type: "topwater_count", value: TIERS.MASTER },
  },

  // TROUT
  {
    id: "trout_amateur",
    name: "Trout Amateur",
    icon: "/badges/BadgeTROUT-AMATEUR.png",
    requirement: { type: "trout_count", value: TIERS.AMATEUR },
  },
  {
    id: "trout_pro",
    name: "Trout Pro",
    icon: "/badges/BadgeTROUT-PRO.png",
    requirement: { type: "trout_count", value: TIERS.PRO },
  },
  {
    id: "trout_master",
    name: "Trout Master",
    icon: "/badges/BadgeTROUT-MASTER.png",
    requirement: { type: "trout_count", value: TIERS.MASTER },
  },

  // TUBE
  {
    id: "tube_amateur",
    name: "Tube Amateur",
    icon: "/badges/BadgeTUBE-AMATEUR.png",
    requirement: { type: "tube_count", value: TIERS.AMATEUR },
  },
  {
    id: "tube_pro",
    name: "Tube Pro",
    icon: "/badges/BadgeTUBE-PRO.png",
    requirement: { type: "tube_count", value: TIERS.PRO },
  },
  {
    id: "tube_master",
    name: "Tube Master",
    icon: "/badges/BadgeTUBE-MASTER.png",
    requirement: { type: "tube_count", value: TIERS.MASTER },
  },

  // WALLEYE
  {
    id: "walleye_amateur",
    name: "Walleye Amateur",
    icon: "/badges/BadgeWALLEYE-AMATEUR.png",
    requirement: { type: "walleye_count", value: TIERS.AMATEUR },
  },
  {
    id: "walleye_pro",
    name: "Walleye Pro",
    icon: "/badges/BadgeWALLEYE-PRO.png",
    requirement: { type: "walleye_count", value: TIERS.PRO },
  },
  {
    id: "walleye_master",
    name: "Walleye Master",
    icon: "/badges/BadgeWALLEYE-MASTER.png",
    requirement: { type: "walleye_count", value: TIERS.MASTER },
  },
];
