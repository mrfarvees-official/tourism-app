import { describe, expect, it } from "vitest";
import { capitalizeWord, isJoinedWord } from "../src/utils/string";

describe("string utilities", () => {
  it("capitalizes the first letter of a simple word", () => {
    expect(capitalizeWord("tourism")).toBe("Tourism");
  });

  it("capitalizes each segment split by hyphen and underscore", () => {
    expect(capitalizeWord("hill-country_trails")).toBe("Hill-Country_Trails");
  });

  it("preserves characters that are not after a separator", () => {
    expect(capitalizeWord("sri lanka travel")).toBe("Sri lanka travel");
  });

  it("accepts joined words with letters, digits, hyphens, and underscores", () => {
    expect(isJoinedWord("lanka-01_trails")).toBe(true);
  });

  it("rejects values containing spaces or punctuation", () => {
    expect(isJoinedWord("lanka trails!")).toBe(false);
  });
});
