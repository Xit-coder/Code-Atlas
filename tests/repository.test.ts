import { describe, expect, it } from "vitest";
import {
  parseRepository,
  repositoryInput,
} from "../packages/shared/src/repository";
describe("GitHub URL boundary", () => {
  it("normalizes a repository URL", () =>
    expect(
      parseRepository("https://github.com/octocat/Hello-World.git/"),
    ).toEqual({
      owner: "octocat",
      repo: "Hello-World",
      url: "https://github.com/octocat/Hello-World",
    }));
  it.each([
    "http://github.com/a/b",
    "https://127.0.0.1/a/b",
    "https://github.com.evil.test/a/b",
    "https://github.com@evil.test/a/b",
    "https://user@github.com/a/b",
    "https://github.com:444/a/b",
    "https://github.com/a/b?x=1",
    "https://github.com/a/b#x",
    "https://github.com/a/b/tree/main",
    "https://github.com/a/%2e%2e",
    "https://github.com/a/b\\c",
    "file:///etc/passwd",
    "https://github.com/-owner/repo",
    "https://github.com/a/..",
  ])("rejects %s", (value) => expect(() => parseRepository(value)).toThrow());
  it("rejects excess fields and excessive input", () => {
    expect(repositoryInput.safeParse({ url: "x".repeat(241) }).success).toBe(
      false,
    );
    expect(
      repositoryInput.safeParse({
        url: "https://github.com/a/b",
        token: "never-accept",
      }).success,
    ).toBe(false);
  });
});
