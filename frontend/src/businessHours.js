export function isSundayInBogota(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    weekday: "short",
  }).format(date) === "Sun";
}
