import { agentHandlers } from '../agents';

async function runDemo() {
  console.log('Running agent-runner demo...');
  const sampleEvent = {
    event: 'issue_comment',
    payload: {
      comment: { body: '/implement add a new endpoint to users' },
      repository: { name: 'test-repo', owner: { login: 'owner' }, default_branch: 'main' },
      issue: { number: 1 }
    }
  } as any;

  const dev = agentHandlers['DeveloperAgent'];
  if (!dev) {
    console.error('DeveloperAgent handler not found');
    return;
  }

  const res = await dev.handle(sampleEvent, {});
  console.log('Demo result:', res);
}

runDemo().catch(err => console.error(err));
