export const bridgeBackModels = {
  dependencyGraph: "gpt-5.6-sol",
  learningPlan: "gpt-5.6-terra",
  pupilSupport: "gpt-5.6-luna",
} as const;

export type BridgeBackModelJob = keyof typeof bridgeBackModels;

