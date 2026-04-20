// Dangerfile: basic PR health checks
const { danger, warn, fail } = require('danger');

const pr = danger.github.pr;
if (pr.title && pr.title.toLowerCase().includes('wip')) {
  warn('PR is marked WIP');
}

const modifiedFiles = danger.git.modified_files.concat(danger.git.created_files || []);
if (modifiedFiles.length > 200) {
  fail('PR is too large (>200 files). Consider splitting into smaller PRs.');
}

// Encourage tests presence when source files changed
const srcChanges = modifiedFiles.filter(p => p.startsWith('src/') || p.startsWith('api/'));
const testChanges = modifiedFiles.some(p => p.startsWith('test/') || p.includes('.spec.') || p.includes('__tests__'));
if (srcChanges.length > 0 && !testChanges) {
  warn('Source files changed but no tests modified. Consider adding tests for new behavior.');
}
