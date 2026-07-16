import { describe, expect, it } from "vitest";

import { layoutConceptGraph, validateDiagnosticQuestions } from "./education";

const graph = {
  nodes: [{ key: "iteration" }, { key: "binary-search" }],
  edges: [{ source: "iteration", target: "binary-search" }],
};

describe("layoutConceptGraph", () => {
  it("places prerequisites before the target", () => {
    const result = layoutConceptGraph({ targetConceptKey: "binary-search", concepts: [
      { key: "iteration", title: "Iteration", description: "Repeat", sourceRef: "slide 2", prerequisiteKeys: [] },
      { key: "binary-search", title: "Binary search", description: "Halve", sourceRef: "objective", prerequisiteKeys: ["iteration"] },
    ] });
    expect(result.nodes.find((node) => node.key === "iteration")?.x).toBeLessThan(result.nodes.find((node) => node.key === "binary-search")?.x ?? 0);
    expect(result.edges).toEqual([{ source: "iteration", target: "binary-search" }]);
  });

  it("rejects a missing target", () => {
    expect(() => layoutConceptGraph({ targetConceptKey: "missing", concepts: [{ key: "iteration", title: "Iteration", description: "Repeat", sourceRef: "slide 2", prerequisiteKeys: [] }] })).toThrow("missing_target");
  });

  it("rejects unknown and self-referencing prerequisites", () => {
    expect(() => layoutConceptGraph({ targetConceptKey: "iteration", concepts: [{ key: "iteration", title: "Iteration", description: "Repeat", sourceRef: "slide 2", prerequisiteKeys: ["unknown"] }] })).toThrow("invalid_edge");
    expect(() => layoutConceptGraph({ targetConceptKey: "iteration", concepts: [{ key: "iteration", title: "Iteration", description: "Repeat", sourceRef: "slide 2", prerequisiteKeys: ["iteration"] }] })).toThrow("invalid_edge");
  });

  it("rejects cyclic concept maps", () => {
    expect(() => layoutConceptGraph({ targetConceptKey: "b", concepts: [
      { key: "a", title: "A", description: "A", sourceRef: "one", prerequisiteKeys: ["b"] },
      { key: "b", title: "B", description: "B", sourceRef: "two", prerequisiteKeys: ["a"] },
    ] })).toThrow("cyclic_graph");
  });
});

describe("validateDiagnosticQuestions", () => {
  it("accepts questions only for prerequisite concepts", () => {
    expect(validateDiagnosticQuestions([{ key: "q1", conceptKey: "iteration", options: ["a", "b", "c"], correctIndex: 1 }], graph)).toHaveLength(1);
  });

  it("rejects the upcoming target and unrelated concepts", () => {
    expect(() => validateDiagnosticQuestions([{ key: "q1", conceptKey: "binary-search", options: ["a", "b", "c"], correctIndex: 1 }], graph)).toThrow("diagnostic_concept_outside_prerequisites");
    expect(() => validateDiagnosticQuestions([{ key: "q1", conceptKey: "unrelated", options: ["a", "b", "c"], correctIndex: 1 }], graph)).toThrow("diagnostic_concept_outside_prerequisites");
  });

  it("rejects invalid answer indexes and duplicate keys", () => {
    expect(() => validateDiagnosticQuestions([{ key: "q1", conceptKey: "iteration", options: ["a", "b", "c"], correctIndex: 3 }], graph)).toThrow("invalid_correct_index");
    expect(() => validateDiagnosticQuestions([
      { key: "q1", conceptKey: "iteration", options: ["a", "b", "c"], correctIndex: 1 },
      { key: "q1", conceptKey: "iteration", options: ["a", "b", "c"], correctIndex: 1 },
    ], graph)).toThrow("duplicate_question_key");
  });
});
