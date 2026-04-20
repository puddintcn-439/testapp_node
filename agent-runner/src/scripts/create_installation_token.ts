import dotenv from 'dotenv';
import { getInstallationOctokit } from '../githubAppAuth';

dotenv.config();

async function main() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {
    console.error('GITHUB_OWNER and GITHUB_REPO must be set in env');
    process.exit(1);
  }
  const oct = await getInstallationOctokit(owner, repo);
  if (!oct) {
    console.error('Failed to get installation Octokit. Ensure GITHUB_APP_ID and GITHUB_PRIVATE_KEY are set and the app is installed on the repo.');
    process.exit(1);
  }
  console.log('OK: installation Octokit acquired — app auth successful');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
