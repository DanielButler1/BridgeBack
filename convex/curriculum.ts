import { query } from "./_generated/server";
import { curriculumPacks } from "../src/lib/curriculum-catalog";

export const catalog = query({
  args: {},
  handler: async () => curriculumPacks,
});
