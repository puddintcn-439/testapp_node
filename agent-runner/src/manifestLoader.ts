import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function loadAgentManifests() {
  // cwd is agent-runner/ when running locally, go up one level to find .github/agents
  const root = path.resolve(process.cwd(), fs.existsSync(path.join(process.cwd(), '.github')) ? '.' : '..');
  const AGENTS_DIR = path.join(root, '.github', 'agents');
  if (!fs.existsSync(AGENTS_DIR)) return [];
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.agent.md') || f.endsWith('.md'));
  const manifests: any[] = [];
  for (const f of files) {
    const content = fs.readFileSync(path.join(AGENTS_DIR, f), 'utf8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;
    try {
      const data = yaml.load(match[1]);
      manifests.push(data);
    } catch (e) {
      console.warn('Failed parsing manifest', f, e);
    }
  }
  return manifests;
}
