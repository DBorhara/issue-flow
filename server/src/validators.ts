import type {
    Priority,
    Status,
} from "./types.js";

export function isStatus(
    value: unknown
): value is Status {
    return (
        value === "Todo" ||
        value === "In Progress" ||
        value === "Done"
    );
}

export function isPriority(
    value: unknown
): value is Priority {
    return (
        value === "Low" ||
        value === "Medium" ||
        value === "High"
    );
}
