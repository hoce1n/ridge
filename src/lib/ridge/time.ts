export function localUtcOffset(now: Date = new Date()): string {
  const minutes = -now.getTimezoneOffset();
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${sign}${hh}:${mm}`;
}

export function createdStamp(
  now: Date = new Date(),
  offset: string = "+00:00"
): { created: string; created_offset: string } {
  return {
    created: now.toISOString(),
    created_offset: offset,
  };
}