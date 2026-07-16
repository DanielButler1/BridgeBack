/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiRuns from "../aiRuns.js";
import type * as analyseLesson from "../analyseLesson.js";
import type * as curriculum from "../curriculum.js";
import type * as generateLearning from "../generateLearning.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_education from "../lib/education.js";
import type * as lib_pathway from "../lib/pathway.js";
import type * as product from "../product.js";
import type * as pupil from "../pupil.js";
import type * as seed from "../seed.js";
import type * as teacher from "../teacher.js";
import type * as viewer from "../viewer.js";
import type * as voice from "../voice.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiRuns: typeof aiRuns;
  analyseLesson: typeof analyseLesson;
  curriculum: typeof curriculum;
  generateLearning: typeof generateLearning;
  "lib/auth": typeof lib_auth;
  "lib/education": typeof lib_education;
  "lib/pathway": typeof lib_pathway;
  product: typeof product;
  pupil: typeof pupil;
  seed: typeof seed;
  teacher: typeof teacher;
  viewer: typeof viewer;
  voice: typeof voice;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
