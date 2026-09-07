import { join } from "node:path";

export function vaultRoot(
  env: NodeJS.ProcessEnv = process.env,
  cwd = process.cwd(),
): string {
  return env.RIDGE_VAULT || join(cwd, "data/vault");
}
