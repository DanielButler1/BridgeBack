export type ConceptEdge = { source: string; target: string };

export function shortestSupportPath({
  target,
  incorrectConcepts,
  edges,
  limit = 3,
}: {
  target: string;
  incorrectConcepts: string[];
  edges: ConceptEdge[];
  limit?: number;
}) {
  const needed = new Set(incorrectConcepts);
  const ancestors = new Set<string>();
  const visit = (concept: string) => {
    for (const edge of edges.filter((item) => item.target === concept)) {
      if (ancestors.has(edge.source)) continue;
      ancestors.add(edge.source);
      visit(edge.source);
    }
  };
  visit(target);

  const safeLimit = Math.max(1, limit);
  const distanceToTarget = (start: string) => {
    const queue = [{ key: start, distance: 0 }];
    const visited = new Set<string>();
    while (queue.length) {
      const current = queue.shift()!;
      if (current.key === target) return current.distance;
      if (visited.has(current.key)) continue;
      visited.add(current.key);
      for (const edge of edges.filter((item) => item.source === current.key)) {
        queue.push({ key: edge.target, distance: current.distance + 1 });
      }
    }
    return Number.POSITIVE_INFINITY;
  };
  const candidates = [...needed]
    .filter((concept) => ancestors.has(concept))
    .sort((a, b) => distanceToTarget(a) - distanceToTarget(b) || a.localeCompare(b))
    .slice(0, safeLimit - 1);
  const indegree = new Map(candidates.map((concept) => [concept, 0]));
  for (const edge of edges) {
    if (indegree.has(edge.source) && indegree.has(edge.target)) {
      indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    }
  }

  const ordered: string[] = [];
  const queue = candidates.filter((concept) => indegree.get(concept) === 0).sort();
  while (queue.length) {
    const concept = queue.shift()!;
    ordered.push(concept);
    for (const edge of edges.filter((item) => item.source === concept)) {
      if (!indegree.has(edge.target)) continue;
      const next = (indegree.get(edge.target) ?? 0) - 1;
      indegree.set(edge.target, next);
      if (next === 0) queue.push(edge.target);
    }
    queue.sort();
  }

  return [...ordered, target];
}
