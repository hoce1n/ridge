export function createdStamp(
  now: Date = new Date(),
  offset: string = "+00:00"
): { created: string; created_offset: string } {
  return {
    created: now.toISOString(),
    created_offset: offset,
  };
}