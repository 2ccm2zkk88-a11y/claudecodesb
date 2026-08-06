import { describe, it, expect } from "vitest";
import { APPS, FILTERS, matchesFilter, matchesQuery } from "./missions.js";

describe("matchesFilter", () => {
  it("matches everything when filter is 'All'", () => {
    for (const app of APPS) {
      expect(matchesFilter(app, "All")).toBe(true);
    }
  });

  it("matches an app whose audience includes the filter (case-insensitive)", () => {
    const app = { audience: "Teachers, students" };
    expect(matchesFilter(app, "Teachers")).toBe(true);
    expect(matchesFilter(app, "teachers")).toBe(true);
    expect(matchesFilter(app, "TEACHERS")).toBe(true);
  });

  it("does not match an app whose audience excludes the filter", () => {
    const app = { audience: "Teachers, students" };
    expect(matchesFilter(app, "Parents")).toBe(false);
  });

  it("every declared FILTERS entry (other than 'All') matches at least one app", () => {
    for (const filter of FILTERS.filter((f) => f !== "All")) {
      const hasMatch = APPS.some((app) => matchesFilter(app, filter));
      expect(hasMatch).toBe(true);
    }
  });
});

describe("matchesQuery", () => {
  it("matches everything when query is empty or whitespace", () => {
    for (const app of APPS) {
      expect(matchesQuery(app, "")).toBe(true);
      expect(matchesQuery(app, "   ")).toBe(true);
    }
  });

  it("matches on name (case-insensitive, substring)", () => {
    const app = APPS.find((a) => a.id === "schoology");
    expect(matchesQuery(app, "school")).toBe(true);
    expect(matchesQuery(app, "SCHOOLOGY")).toBe(true);
  });

  it("matches on role", () => {
    const app = APPS.find((a) => a.id === "classlink");
    expect(matchesQuery(app, "mission control")).toBe(true);
  });

  it("matches on audience", () => {
    const app = APPS.find((a) => a.id === "destiny");
    expect(matchesQuery(app, "librarians")).toBe(true);
  });

  it("matches on ttess", () => {
    const app = APPS.find((a) => a.id === "brainpop");
    expect(matchesQuery(app, "domain 2")).toBe(true);
  });

  it("does not match an unrelated query", () => {
    const app = APPS.find((a) => a.id === "gale");
    expect(matchesQuery(app, "xyz-not-present")).toBe(false);
  });

  it("trims surrounding whitespace before matching", () => {
    const app = APPS.find((a) => a.id === "worldbook");
    expect(matchesQuery(app, "  world book  ")).toBe(true);
  });
});

describe("APPS data integrity", () => {
  const requiredFields = ["id", "name", "emoji", "role", "color", "audience", "core", "painPoint", "coach", "ttess"];

  it("has at least one app", () => {
    expect(APPS.length).toBeGreaterThan(0);
  });

  it("every app has all required, non-empty fields", () => {
    for (const app of APPS) {
      for (const field of requiredFields) {
        expect(app[field], `${app.id ?? "<unknown>"}.${field}`).toBeTruthy();
      }
    }
  });

  it("every app id is unique", () => {
    const ids = APPS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
