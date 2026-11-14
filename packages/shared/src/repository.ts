import { z } from "zod";

export const repositoryInput = z.object({ url: z.string().max(240) }).strict();

/** Accept only a canonical GitHub repository URL; never use input as a fetch target. */
export function parseRepository(value: string) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    url.port ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Use uma URL HTTPS de repositório público do GitHub, sem parâmetros.",
    );
  }
  const parts = url.pathname.replace(/\/$/, "").split("/");
  const owner = parts[1];
  const repo = parts[2]?.replace(/\.git$/, "");
  if (
    parts.length !== 3 ||
    !owner ||
    !repo ||
    !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(owner) ||
    !/^[\w.-]{1,100}$/.test(repo) ||
    repo === "." ||
    repo === ".." ||
    /%|\\/.test(value)
  ) {
    throw new Error("Informe https://github.com/proprietario/repositorio.");
  }
  return { owner, repo, url: `https://github.com/${owner}/${repo}` };
}

export interface RepositoryInfo {
  owner: string;
  repo: string;
  url: string;
  description: string | null;
  defaultBranch: string;
  commit: string;
  language: string | null;
  sizeKiB: number;
}
