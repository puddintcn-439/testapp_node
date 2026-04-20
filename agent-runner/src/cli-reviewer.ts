import fs from 'fs';
import dotenv from 'dotenv';
import { loadAgentManifests } from './manifestLoader';
import { agentHandlers } from './agents';

dotenv.config();

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const eventName = process.env.GITHUB_EVENT_NAME || 'pull_request';
  if (!eventPath) {
    console.error('GITHUB_EVENT_PATH not set');
    process.exit(1);
  }
  const raw = fs.readFileSync(eventPath, 'utf8');
  const payload = JSON.parse(raw);
  const manifests = loadAgentManifests();
  const handler = agentHandlers['ReviewerAgent'];
  if (!handler) {
    console.error('ReviewerAgent handler not found');
    process.exit(1);
  }
  await handler.handle({ event: eventName, payload }, manifests.find((m: any) => m.name === 'ReviewerAgent'));
  console.log('ReviewerAgent executed');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
