import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

export async function getInstallationOctokit(owner: string, repo: string): Promise<Octokit | null> {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY;
  if (!appId || !privateKey) return null;

  const appOctokit = new Octokit({ authStrategy: createAppAuth as any, auth: { appId: Number(appId), privateKey } as any });
  try {
    const { data: installation } = await appOctokit.rest.apps.getRepoInstallation({ owner, repo });
    const installationId = installation.id;
    const { data: tokenData } = await appOctokit.rest.apps.createInstallationAccessToken({ installation_id: installationId });
    const installationToken = tokenData.token;
    const octokit = new Octokit({ auth: installationToken });
    return octokit;
  } catch (err) {
    console.error('getInstallationOctokit error', err);
    return null;
  }
}

export default { getInstallationOctokit };
