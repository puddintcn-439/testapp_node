import { generatePatchFromPrompt } from '../llmAdapter';
import { createBranchFromBase, createOrUpdateFileOnBranch, createDraftPR, createPrComment } from '../github';

export async function handle(event: any, manifest: any) {
  console.log('[DeveloperAgent] handle', event.event);
  const issue = event.payload.issue || {};
  const comment = event.payload.comment || {};
  const body = (comment.body || issue.body || '').toString();
  const prompt = body.replace('/implement', '').trim() || 'implement requested';
  const suggestion = await generatePatchFromPrompt(prompt);
  console.log('[DeveloperAgent] suggestion', suggestion);

  const repo = event.payload.repository;
  if (repo && repo.name && repo.owner) {
    const owner = repo.owner.login || repo.owner.name;
    const repoName = repo.name;
    const baseBranch = repo.default_branch || 'main';
    const branch = `agent/developer/${Date.now()}`;
    if (process.env.GITHUB_TOKEN) {
      await createBranchFromBase(owner, repoName, branch, baseBranch);
      for (const f of suggestion.files || []) {
        await createOrUpdateFileOnBranch(owner, repoName, branch, f.path, f.content, `agent: add suggestion ${f.path}`);
      }
      const pr = await createDraftPR(owner, repoName, suggestion.title || 'Agent suggestion', suggestion.pr_body || '', branch, baseBranch);
      if (pr && issue.number) {
        await createPrComment(owner, repoName, issue.number, `Created draft PR: ${pr.html_url}`);
      }
      return { pr };
    }
  }
  return { suggestion };
}
