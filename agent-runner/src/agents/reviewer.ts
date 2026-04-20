import { analyzeDiffMock } from '../analysis';
import { createPrComment } from '../github';

export async function handle(event: any, manifest: any) {
  console.log('[ReviewerAgent] handle', event.event);
  const pr = event.payload.pull_request || {};
  const repo = event.payload.repository || {};
  const owner = repo.owner?.login || repo.owner?.name;
  const repoName = repo.name;
  const prNumber = pr.number;
  const findings = analyzeDiffMock(pr);
  const summary = findings.map((f: any) => `- ${f.file}:${f.line} (${f.severity}) ${f.message}`).join('\n');
  const body = `Automated review findings:\n\n${summary}\n\n(These are automated checks from ReviewerAgent.)`;
  if (owner && repoName && prNumber && process.env.GITHUB_TOKEN) {
    await createPrComment(owner, repoName, prNumber, body);
  } else {
    console.log('[ReviewerAgent] findings', findings);
  }
  return { findings };
}
