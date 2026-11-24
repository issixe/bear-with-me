// Helpers for all the validators

export const MOODS = ["calm", "frustrated", "angry"];
export const SCORE_CRITERIA = [
    "compliance",
    "process",
    "communication",
    "efficiency",
    "outcome",
];

export const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";
export const isPlainObject = (v) =>
    typeof v === "object" && v !== null && !Array.isArray(v);
