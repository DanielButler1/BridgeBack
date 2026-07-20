export function incorrectAnswerFeedback(feedback: string) {
  const explanation = feedback
    .trim()
    .replace(/^(?:correct|that(?:'|’)s right|you got it)[!,:.\s-]*/i, "")
    .trim();
  const sentence = explanation
    ? `${explanation.charAt(0).toUpperCase()}${explanation.slice(1)}`
    : "";

  return sentence
    ? `Not quite yet. ${sentence}`
    : "Not quite yet. Review the worked example and try another answer.";
}
