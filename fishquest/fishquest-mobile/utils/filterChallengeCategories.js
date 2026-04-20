export function allChallenges(challenges) {
  return challenges;
}
export function filterByDaily(challenges) {
  return challenges.filter((c) => c.scheduleType === "daily");
}
export function filterBySpecies(challenges) {
  return challenges.filter((c) => c.type === "species_count");
}
export function filterByTimed(challenges) {
  return challenges.filter((c) => c.type === "timed");
}
export function filterByLuck(challenges) {
  return challenges.filter((c) => c.type === "luck");
}
export function filterByRig(challenges) {
  return challenges.filter((c) => c.type === "rig");
}
export function filterByAdventure(challenges) {
  return challenges.filter((c) => c.type === "adventure");
}
export function limitChallenges(challenges, count) {
  return challenges.slice(0, count);
}
