import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function loadAgentManifests() {
  const AGENTS_DIR = path.join(process.cwd(), '.github', 'agents');
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
