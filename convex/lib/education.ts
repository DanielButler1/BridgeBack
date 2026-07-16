export type DraftConcept = {
  key: string;
  title: string;
  description: string;
  sourceRef: string;
  prerequisiteKeys: string[];
};

export type DraftGraph = { targetConceptKey: string; concepts: DraftConcept[] };
export type StoredGraph = {
  nodes: Array<{ key: string }>;
  edges: Array<{ source: string; target: string }>;
};
export type DiagnosticQuestion = { key: string; conceptKey: string; options: string[]; correctIndex: number };

export function layoutConceptGraph(parsed: DraftGraph) {
  const concepts = new Map(parsed.concepts.map((concept) => [concept.key, concept]));
  if (!concepts.has(parsed.targetConceptKey)) throw new Error("missing_target");
  for (const concept of parsed.concepts) {
    if (concept.prerequisiteKeys.some((key) => !concepts.has(key) || key === concept.key)) throw new Error("invalid_edge");
  }

  const depth = new Map<string, number>();
  const findDepth = (key: string, trail = new Set<string>()): number => {
    if (trail.has(key)) throw new Error("cyclic_graph");
    if (depth.has(key)) return depth.get(key)!;
    const concept = concepts.get(key)!;
    const nextTrail = new Set(trail).add(key);
    const value = concept.prerequisiteKeys.length === 0 ? 0 : 1 + Math.max(...concept.prerequisiteKeys.map((item) => findDepth(item, nextTrail)));
    depth.set(key, value);
    return value;
  };
  parsed.concepts.forEach((concept) => findDepth(concept.key));

  const rows = new Map<number, number>();
  const nodes = parsed.concepts.map((concept) => {
    const column = depth.get(concept.key) ?? 0;
    const row = rows.get(column) ?? 0;
    rows.set(column, row + 1);
    return { key: concept.key, title: concept.title, description: concept.description, sourceRef: concept.sourceRef, x: column * 260, y: row * 150 + 40 };
  });
  const edges = parsed.concepts.flatMap((concept) => concept.prerequisiteKeys.map((source) => ({ source, target: concept.key })));
  return { targetConceptKey: parsed.targetConceptKey, nodes, edges };
}

export function validateDiagnosticQuestions<T extends DiagnosticQuestion>(questions: T[], graph: StoredGraph) {
  const conceptKeys = new Set(graph.nodes.map((node) => node.key));
  const prerequisiteKeys = new Set(graph.edges.map((edge) => edge.source));
  const questionKeys = new Set<string>();
  for (const question of questions) {
    if (!conceptKeys.has(question.conceptKey) || !prerequisiteKeys.has(question.conceptKey)) throw new Error("diagnostic_concept_outside_prerequisites");
    if (question.correctIndex < 0 || question.correctIndex >= question.options.length) throw new Error("invalid_correct_index");
    if (questionKeys.has(question.key)) throw new Error("duplicate_question_key");
    questionKeys.add(question.key);
  }
  return questions;
}
