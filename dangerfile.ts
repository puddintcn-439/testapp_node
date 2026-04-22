import { danger, warn, fail, message } from "danger";

// ── PR hygiene ─────────────────────────────────────────────────────────────

// Require a non-trivial PR description
if (!danger.github.pr.body || danger.github.pr.body.trim().length < 20) {
  warn("Please provide a meaningful PR description (at least 20 characters).");
}

// Warn if PR is too large
const bigPRThreshold = 500;
const totalChanges =
  (danger.github.pr.additions ?? 0) + (danger.github.pr.deletions ?? 0);
if (totalChanges > bigPRThreshold) {
  warn(
    `This PR changes ${totalChanges} lines. Consider breaking it into smaller PRs for easier review.`
  );
}

// ── Source / test balance ──────────────────────────────────────────────────

const modifiedSrc = danger.git.modified_files.filter(
  (f) => f.startsWith("src/") && f.endsWith(".ts") && !f.includes("__tests__")
);
const modifiedTests = danger.git.modified_files.filter((f) =>
  f.includes("__tests__")
);
const createdTests = danger.git.created_files.filter((f) =>
  f.includes("__tests__")
);

if (modifiedSrc.length > 0 && modifiedTests.length + createdTests.length === 0) {
  warn(
    "Source files were changed but no tests were modified or added. Please add or update tests."
  );
}

// ── Security: no secrets ───────────────────────────────────────────────────

const secretPatterns = [
  /password\s*=\s*['"][^'"]{4,}/i,
  /secret\s*=\s*['"][^'"]{4,}/i,
  /api[_-]?key\s*=\s*['"][^'"]{4,}/i,
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,
];

const allFiles = [
  ...danger.git.created_files,
  ...danger.git.modified_files,
];

// Only flag non-secret, non-env files
const filesToCheck = allFiles.filter(
  (f) =>
    !f.includes(".env") &&
    !f.endsWith(".md") &&
    !f.includes("node_modules")
);

// We can't read file contents in dangerfile without async diff reads,
// so warn if .env files were accidentally committed
const envFiles = allFiles.filter(
  (f) => f.match(/\.env(\.|$)/) && !f.endsWith(".example")
);
if (envFiles.length > 0) {
  fail(`Potential secret file committed: ${envFiles.join(", ")}. Remove it immediately.`);
}

// ── vercel.json guard ──────────────────────────────────────────────────────

const vercelChanged = allFiles.includes("vercel.json");
if (vercelChanged) {
  message(
    "**vercel.json** was modified. Please confirm `outputDirectory`, `buildCommand`, and rewrite rules are correct before merging."
  );
}

// ── Lockfile consistency ───────────────────────────────────────────────────

const pkgChanged = danger.git.modified_files.includes("package.json");
const lockChanged = danger.git.modified_files.includes("package-lock.json");

if (pkgChanged && !lockChanged) {
  warn(
    "`package.json` was modified but `package-lock.json` was not updated. Run `npm install` to sync the lockfile."
  );
}
