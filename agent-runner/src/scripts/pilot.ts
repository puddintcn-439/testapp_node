import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';

dotenv.config();

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!token) {
    console.error('GITHUB_TOKEN is required to run the pilot (create issue/comment)');
    process.exit(1);
  }
  if (!owner || !repo) {
    console.error('GITHUB_OWNER and GITHUB_REPO must be set');
    process.exit(1);
  }
  const oct = new Octokit({ auth: token });
  try {
    const issue = await oct.issues.create({ owner, repo, title: 'Pilot: agent-runner test issue', body: 'Pilot issue created by agent-runner pilot script. Reply comment with `/implement` to trigger DeveloperAgent.' });
    console.log('Created issue:', issue.data.html_url);
    const comment = await oct.issues.createComment({ owner, repo, issue_number: issue.data.number, body: '/implement add a sample endpoint for pilot' });
    console.log('Posted implement comment. Monitor agent-runner/logs/audit.log and GitHub for draft PRs.');
  } catch (err) {
    console.error('Pilot failed:', err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
