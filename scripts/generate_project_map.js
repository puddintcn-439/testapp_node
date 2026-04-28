#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const ROOT = process.cwd();

function isIgnored(p) {
  return p.includes('node_modules') || p.includes('.git') || p.includes('dist') || p.includes('build');
}

async function walk(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const d of list) {
    const full = path.join(dir, d.name);
    if (isIgnored(full)) continue;
    if (d.isDirectory()) {
      results = results.concat(await walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\\\/g, '/');
}

function groupFiles(files, pattern) {
  return files.filter((f) => f.includes(pattern)).map(rel).sort();
}

async function main() {
  const files = await walk(ROOT);

  const mapping = {
    client: {
      components: {},
      api_wrappers: {}
    },
    server: {
      routes: {},
      controllers: {},
      services: {},
      models: {},
      config: {}
    },
    scripts: {},
    db: { tables: [] }
  };

  // client components
  for (const f of files) {
    const fn = f.replace(/\\\\/g, '/');
    if (fn.includes('client/src/components/')) {
      const name = path.basename(fn).replace(/\.(tsx|jsx|ts|js)$/, '');
      mapping.client.components[name] = rel(f);
    }
    if (fn.includes('client/src/api/')) {
      const name = path.basename(fn).replace(/\.(ts|js)$/, '');
      mapping.client.api_wrappers[name] = rel(f);
    }
    if (fn.includes('src/routes/') && fn.endsWith('.ts')) {
      const name = path.basename(fn).replace(/\.ts$/, '').replace(/Routes?$/i, '');
      mapping.server.routes[name || path.basename(fn)] = rel(f);
    }
    if (fn.includes('src/controllers/') && fn.endsWith('.ts')) {
      const name = path.basename(fn).replace(/\.ts$/, '');
      mapping.server.controllers[name] = rel(f);
    }
    if (fn.includes('src/services/') && fn.endsWith('.ts')) {
      const name = path.basename(fn).replace(/\.ts$/, '');
      mapping.server.services[name] = rel(f);
    }
    if (fn.includes('src/models/') && fn.endsWith('.ts')) {
      const name = path.basename(fn).replace(/\.ts$/, '');
      mapping.server.models[name] = rel(f);
    }
    if (fn.includes('src/config/') && fn.endsWith('.ts')) {
      const name = path.basename(fn).replace(/\.ts$/, '');
      mapping.server.config[name] = rel(f);
    }
    if (fn.includes('scripts/') && (fn.endsWith('.js') || fn.endsWith('.ts'))) {
      const name = path.basename(fn);
      mapping.scripts[name] = rel(f);
    }
  }

  // best-effort DB table names (scan db.ts)
  try {
    const dbFile = path.join(ROOT, 'src', 'config', 'db.ts');
    const txt = await fs.readFile(dbFile, 'utf8');
    const tbls = new Set();
    // look for CREATE TABLE or table names in SQL strings
    const rx = /CREATE TABLE IF NOT EXISTS\\s+([a-zA-Z0-9_]+)|CREATE TABLE\\s+([a-zA-Z0-9_]+)/gi;
    let m;
    while ((m = rx.exec(txt))) {
      tbls.add((m[1] || m[2] || '').trim());
    }
    if (tbls.size > 0) mapping.db.tables = Array.from(tbls);
  } catch (e) {
    // ignore
  }

  const outJson = JSON.stringify(mapping, null, 2);

  const md = [`# Project Map — Generated`, ``, `Generated: ${new Date().toISOString()}`, ``, `## Machine mapping (JSON)`, '', '```json', outJson, '```', '', '---', '', '## Human-readable mapping and relationships', ''];

  // human readable examples
  const examples = [];
  if (mapping.client.components.LoginForm && mapping.client.api_wrappers.authApi) {
    examples.push(
      `- \`LoginForm\` -> \`authApi\` -> \`authRoutes\` -> \`authController\` -> \`authService\` -> DB: \`users\``
    );
  }
  examples.push('- Add more relationships by updating this script or the generated file.');

  const content = md.concat(examples).join('\n');

  await fs.mkdir(path.join(ROOT, 'docs'), { recursive: true });
  const outPath = path.join(ROOT, 'docs', 'project_map.md');
  await fs.writeFile(outPath, content, 'utf8');
  console.log('Wrote', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
