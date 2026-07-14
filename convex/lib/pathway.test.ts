import { describe, expect, it } from "vitest";

import { shortestSupportPath } from "./pathway";

const edges = [
  { source: "arrays", target: "indexing" },
  { source: "indexing", target: "trace-tables" },
  { source: "comparisons", target: "trace-tables" },
  { source: "iteration", target: "binary-search" },
  { source: "trace-tables", target: "binary-search" },
  { source: "sorted-data", target: "binary-search" },
];

describe("shortestSupportPath", () => {
  it("returns no more than three concepts including the target", () => {
    expect(shortestSupportPath({
      target: "binary-search",
      incorrectConcepts: ["arrays", "indexing", "comparisons", "iteration", "trace-tables"],
      edges,
      limit: 3,
    })).toEqual(["iteration", "trace-tables", "binary-search"]);
  });

  it("ignores incorrect concepts that do not unlock the upcoming target", () => {
    expect(shortestSupportPath({
      target: "binary-search",
      incorrectConcepts: ["unrelated-topic", "sorted-data"],
      edges,
      limit: 3,
    })).toEqual(["sorted-data", "binary-search"]);
  });

  it("returns only the target when prerequisites are already secure", () => {
    expect(shortestSupportPath({
      target: "binary-search",
      incorrectConcepts: [],
      edges,
      limit: 3,
    })).toEqual(["binary-search"]);
  });
});
