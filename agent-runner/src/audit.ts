import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'agent-runner', 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
const LOG_FILE = path.join(LOG_DIR, 'audit.log');

export function logEvent(entry: any) {
  const line = `[${new Date().toISOString()}] ${JSON.stringify(entry)}\n`;
  fs.appendFileSync(LOG_FILE, line, 'utf8');
}

export default { logEvent };
