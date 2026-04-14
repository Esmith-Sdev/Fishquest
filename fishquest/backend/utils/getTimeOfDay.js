export default function getTimeOfDay(date) {
  const hours = new Date(date).getHours();

  if (hours >= 5 && hours < 12) return "morning";
  if (hours >= 12 && hours < 18) return "day";
  return "night";
}
