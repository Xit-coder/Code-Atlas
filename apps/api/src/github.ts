import { z } from "zod";
import {
  parseRepository,
  type RepositoryInfo,
} from "../../../packages/shared/src/repository";

export class UpstreamError extends Error {
  constructor(
    public readonly status: 404 | 429 | 502,
    message: string,
  ) {
    super(message);
  }
}

async function githubJson(path: string, fetcher: typeof fetch) {
  const response = await fetcher(`https://api.github.com${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(8000),
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "CodeAtlas/0.1",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) {
    await response.body?.cancel();
    if (response.status === 404)
      throw new UpstreamError(404, "Repositório público não encontrado.");
    if (response.status === 403 || response.status === 429)
      throw new UpstreamError(
        429,
        "Limite do GitHub atingido. Tente mais tarde.",
      );
    throw new UpstreamError(502, "O GitHub não respondeu como esperado.");
  }
  const reader = response.body?.getReader();
  if (!reader) throw new UpstreamError(502, "Resposta vazia do GitHub.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 65_536)
        throw new UpstreamError(502, "Resposta do GitHub excedeu o limite.");
      chunks.push(part.value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}

const metadata = z.object({
  private: z.literal(false),
  description: z.string().nullable(),
  default_branch: z.string().min(1),
  language: z.string().nullable(),
  size: z.number().nonnegative(),
});
const commitSchema = z.object({ sha: z.string().regex(/^[a-f0-9]{40}$/) });

export async function inspectRepository(
  value: string,
  fetcher: typeof fetch = (input, init) => fetch(input, init),
): Promise<RepositoryInfo> {
  const parsed = parseRepository(value);
  const path = `/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`;
  const repo = metadata.parse(await githubJson(path, fetcher));
  const commit = commitSchema.parse(
    await githubJson(
      `${path}/commits/${encodeURIComponent(repo.default_branch)}`,
      fetcher,
    ),
  );
  return {
    ...parsed,
    description: repo.description,
    defaultBranch: repo.default_branch,
    commit: commit.sha,
    language: repo.language,
    sizeKiB: repo.size,
  };
}
