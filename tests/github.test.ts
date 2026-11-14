import { expect, it, vi } from "vitest";
import { inspectRepository } from "../apps/api/src/github";
// Synthetic HTTP responses exercise protocol handling, never displayed as repository analyses.
it("uses official endpoints and preserves the exact returned commit", async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      Response.json({
        private: false,
        description: null,
        default_branch: "feature/main",
        language: "TypeScript",
        size: 1,
      }),
    )
    .mockResolvedValueOnce(Response.json({ sha: "a".repeat(40) }));
  const result = await inspectRepository(
    "https://github.com/owner/repo",
    fetcher,
  );
  expect(result.commit).toBe("a".repeat(40));
  expect(fetcher.mock.calls[1]?.[0]).toBe(
    "https://api.github.com/repos/owner/repo/commits/feature%2Fmain",
  );
  expect(fetcher.mock.calls[0]?.[1]?.redirect).toBe("manual");
});
it("rejects unsafe URLs before any fetch", async () => {
  const fetcher = vi.fn<typeof fetch>();
  await expect(
    inspectRepository("https://localhost/private", fetcher),
  ).rejects.toThrow();
  expect(fetcher).not.toHaveBeenCalled();
});
it("handles quota failures", async () => {
  await expect(
    inspectRepository(
      "https://github.com/a/b",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response("", { status: 403 })),
    ),
  ).rejects.toMatchObject({ status: 429 });
});
it("bounds upstream response size even without content-length", async () => {
  await expect(
    inspectRepository(
      "https://github.com/a/b",
      vi.fn<typeof fetch>().mockResolvedValue(new Response("x".repeat(65537))),
    ),
  ).rejects.toMatchObject({ status: 502 });
});
it("does not expose private repositories", async () => {
  await expect(
    inspectRepository(
      "https://github.com/a/b",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json({ private: true })),
    ),
  ).rejects.toThrow();
});
it("rejects redirects without requesting their destination", async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(null, {
      status: 302,
      headers: { Location: "http://127.0.0.1/private" },
    }),
  );
  await expect(
    inspectRepository("https://github.com/a/b", fetcher),
  ).rejects.toMatchObject({ status: 502 });
  expect(fetcher).toHaveBeenCalledTimes(1);
});
