import { describe, expect, it } from "vitest";

import { incorrectAnswerFeedback } from "./learning-feedback";

describe("incorrectAnswerFeedback", () => {
  it("removes a contradictory correct prefix from generated feedback", () => {
    expect(incorrectAnswerFeedback('Correct: index 2 refers to the third item, "fish".')).toBe(
      'Not quite yet. Index 2 refers to the third item, "fish".',
    );
  });

  it("keeps a useful neutral explanation", () => {
    expect(incorrectAnswerFeedback("Index positions start at zero.")).toBe(
      "Not quite yet. Index positions start at zero.",
    );
  });

  it("provides a fallback when generated feedback is empty", () => {
    expect(incorrectAnswerFeedback(" ")).toBe(
      "Not quite yet. Review the worked example and try another answer.",
    );
  });
});
