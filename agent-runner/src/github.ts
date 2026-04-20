import { Octokit } from '@octokit/rest';
import { getInstallationOctokit } from './githubAppAuth';

const token = process.env.GITHUB_TOKEN;
const staticOctokit = token ? new Octokit({ auth: token }) : null;

async function getOctokitForRepo(owner?: string, repo?: string): Promise<Octokit | null> {
  // Prefer GitHub App installation token if available
  if (process.env.GITHUB_APP_ID && process.env.GITHUB_PRIVATE_KEY && owner && repo) {
    const inst = await getInstallationOctokit(owner, repo);
    if (inst) return inst;
  }
  return staticOctokit;
}

export async function getRepoDefaultBranch(owner: string, repo: string): Promise<string | null> {
  const oct = await getOctokitForRepo(owner, repo);
  if (!oct) return null;
  try {
    const { data } = await oct.rest.repos.get({ owner, repo });
    return data.default_branch;
  } catch (err) {
    console.error('getRepoDefaultBranch error', err);
    return null;
  }
}

export async function createBranchFromBase(owner: string, repo: string, newBranch: string, baseBranch?: string) {
  const oct = await getOctokitForRepo(owner, repo);
  if (!oct) {
    console.log('[github] No auth available; cannot create branch');
    return null;
  }
  try {
    const base = baseBranch || (await getRepoDefaultBranch(owner, repo)) || 'main';
    const ref = await oct.rest.git.getRef({ owner, repo, ref: `heads/${base}` });
    const sha = ref.data.object.sha;
    await oct.rest.git.createRef({ owner, repo, ref: `refs/heads/${newBranch}`, sha });
    return newBranch;
  } catch (err: any) {
    if (err?.status === 422 && String(err?.message).includes('Reference already exists')) {
      console.log('[github] branch already exists', newBranch);
      return newBranch;
    }
    console.error('createBranchFromBase error', err);
    throw err;
  }
}

export async function createOrUpdateFileOnBranch(owner: string, repo: string, branch: string, path: string, content: string, message = 'agent: add suggestion') {
  const oct = await getOctokitForRepo(owner, repo);
  if (!oct) {
    console.log('[github] No auth; skipping file write', { owner, repo, path, branch });
    return null;
  }
  try {
    const contentBase64 = Buffer.from(content, 'utf8').toString('base64');
    try {
      const existing = await oct.rest.repos.getContent({ owner, repo, path, ref: branch });
      const sha = (existing.data as any).sha;
      const res = await oct.rest.repos.createOrUpdateFileContents({ owner, repo, path, message, content: contentBase64, branch, sha });
      return res.data;
    } catch (e) {
      const res = await oct.rest.repos.createOrUpdateFileContents({ owner, repo, path, message, content: contentBase64, branch });
      return res.data;
    }
  } catch (err) {
    console.error('createOrUpdateFileOnBranch error', err);
    throw err;
  }
}

export async function createDraftPR(owner: string, repo: string, title: string, body: string, headBranch: string, baseBranch?: string) {
  const oct = await getOctokitForRepo(owner, repo);
  if (!oct) {
    console.log('[github] No auth; skipping PR creation', { owner, repo, title, headBranch });
    return null;
  }
  try {
    const base = baseBranch || (await getRepoDefaultBranch(owner, repo)) || 'main';
    const res = await oct.rest.pulls.create({ owner, repo, title, head: headBranch, base, body, draft: true });
    return res.data;
  } catch (err) {
    console.error('createDraftPR error', err);
    throw err;
  }
}

export async function createPrComment(owner: string, repo: string, issueNumber: number, body: string) {
  const oct = await getOctokitForRepo(owner, repo);
  if (!oct) {
    console.log('[github] No auth; skipping comment', { owner, repo, issueNumber });
    return null;
  }
  try {
    const res = await oct.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
    return res.data;
  } catch (err) {
    console.error('createPrComment error', err);
    throw err;
  }
}

export default { getRepoDefaultBranch, createBranchFromBase, createOrUpdateFileOnBranch, createDraftPR, createPrComment };
