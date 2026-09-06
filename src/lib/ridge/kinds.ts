export const KINDS = [
    "learned",
    "built",
    "broke",
    "debugged",
    "shipped",
    "documented",
    "decided",
    "experimented",
] as const;

export type Kind = (typeof KINDS)[number];

export function isKind(value: string): value is Kind {
    return (KINDS as readonly string[]).includes(value);
}