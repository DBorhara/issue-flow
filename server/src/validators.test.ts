import {
    describe,
    expect,
    it,
} from "vitest";

import {
    isPriority,
    isStatus,
} from "./validators.js";

describe("isStatus", () => {
    it("accepts valid statuses", () => {
        expect(isStatus("Todo")).toBe(true);
        expect(isStatus("In Progress")).toBe(true);
        expect(isStatus("Done")).toBe(true);
    });

    it("rejects invalid statuses", () => {
        expect(isStatus("Almost Done")).toBe(false);
        expect(isStatus("")).toBe(false);
        expect(isStatus("todo")).toBe(false);
    });

    it("rejects non-string values", () => {
        expect(isStatus(10)).toBe(false);
        expect(isStatus(null)).toBe(false);
        expect(isStatus(undefined)).toBe(false);
    });
});

describe("isPriority", () => {
    it("accepts valid priorities", () => {
        expect(isPriority("Low")).toBe(true);
        expect(isPriority("Medium")).toBe(true);
        expect(isPriority("High")).toBe(true);
    });

    it("rejects invalid priorities", () => {
        expect(isPriority("Critical")).toBe(false);
        expect(isPriority("")).toBe(false);
        expect(isPriority("high")).toBe(false);
    });

    it("rejects non-string values", () => {
        expect(isPriority(3)).toBe(false);
        expect(isPriority(null)).toBe(false);
        expect(isPriority(undefined)).toBe(false);
    });
});
