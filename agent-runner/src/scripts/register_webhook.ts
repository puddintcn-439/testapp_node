import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { getInstallationOctokit } from '../githubAppAuth';

dotenv.config();

async function getOctokit(owner: string, repo: string) {
  const inst = await getInstallationOctokit(owner, repo);
  if (inst) return inst;
  if (process.env.GITHUB_TOKEN) return new Octokit({ auth: process.env.GITHUB_TOKEN });
  return null;
}

async function main() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const webhookUrl = process.env.WEBHOOK_URL;
  const secret = process.env.WEBHOOK_SECRET;
  if (!owner || !repo || !webhookUrl) {
    console.error('GITHUB_OWNER, GITHUB_REPO and WEBHOOK_URL env vars are required');
    process.exit(1);
  }
  const oct = await getOctokit(owner, repo);
  if (!oct) {
    console.error('No auth available (set GITHUB_TOKEN or configure GitHub App)');
    process.exit(1);
  }
  try {
    const res = await oct.rest.repos.createWebhook({
      owner,
      repo,
      config: { url: webhookUrl, content_type: 'json', secret: secret || undefined },
      events: ['pull_request', 'issue_comment'],
      active: true
    });
    console.log('Webhook created:', res.data.id);
  } catch (err) {
    console.error('Failed to create webhook:', err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
