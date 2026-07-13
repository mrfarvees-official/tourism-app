import { describe, expect, it } from "vitest";
import { formatLastSeen } from "../src/utils/time";

describe("time utilities", () => {
  it("formats timestamps into the expected human-readable shape", () => {
    const result = formatLastSeen("2026-07-13T12:34:56.000Z");

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (AM|PM)$/);
    expect(result).not.toBe("Invalid Date");
  });
});
