import { describe, expect, it } from "vitest";

import { curriculumPacks, findCurriculumPack, findCurriculumTopic } from "./curriculum-catalog";

describe("curriculum catalog", () => {
  it("ships the current OCR Computer Science and Mathematics packs", () => {
    expect(findCurriculumPack("ocr-j277-v3.1")?.version).toBe("3.1");
    expect(findCurriculumPack("ocr-j560-v2.0")?.version).toBe("2.0");
  });

  it("covers every named J277 area and subtopic", () => {
    const topics = findCurriculumPack("ocr-j277-v3.1")?.topics ?? [];
    expect(topics.filter((item) => item.kind === "strand")).toHaveLength(11);
    expect(topics.filter((item) => item.kind === "topic")).toHaveLength(27);
  });

  it("covers all 12 J560 strands with lesson-level choices", () => {
    const topics = findCurriculumPack("ocr-j560-v2.0")?.topics ?? [];
    expect(topics.filter((item) => item.kind === "strand")).toHaveLength(12);
    expect(topics.filter((item) => item.kind === "topic")).toHaveLength(41);
  });

  it("uses unique codes and resolvable relationships within each pack", () => {
    for (const pack of curriculumPacks) {
      const codes = new Set(pack.topics.map((item) => item.code));
      expect(codes.size).toBe(pack.topics.length);
      for (const item of pack.topics) {
        if (item.parentCode) expect(codes.has(item.parentCode)).toBe(true);
        for (const prerequisite of item.prerequisiteCodes) expect(codes.has(prerequisite)).toBe(true);
      }
    }
  });

  it("finds curriculum topics only inside their own pack", () => {
    expect(findCurriculumTopic("ocr-j277-v3.1", "2.1.3")?.title).toBe("Searching and sorting algorithms");
    expect(findCurriculumTopic("ocr-j560-v2.0", "2.1.3")).toBeUndefined();
  });
});
