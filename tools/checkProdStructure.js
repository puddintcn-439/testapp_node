#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, skip = new Set(['node_modules', '.git'])) {
  let results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (skip.has(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) results = results.concat(walk(full, skip));
      else results.push(full);
    }
  } catch (err) {
    // ignore permission errors
  }
  return results;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function rel(p, base) {
  return toPosix(path.relative(base, p));
}

function patternToRegex(pattern) {
  // Very small glob -> regex converter: supports **, *, ?
  pattern = pattern.replace(/^\/*/, '').replace(/\\/g, '/');
  const special = /[.+^${}()|[\]\\]/g;
  let out = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '*') {
      if (pattern[i + 1] === '*') {
        out += '.*';
        i++;
      } else {
        out += '[^/]*';
      }
    } else if (ch === '?') {
      out += '.';
    } else {
      out += ch.replace(special, '\\$&');
    }
  }
  return new RegExp('^' + out + '$');
}

function findVercelFiles(repoRoot) {
  const files = walk(repoRoot);
  return files.filter((f) => path.basename(f).toLowerCase() === 'vercel.json');
}

function loadJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return null;
  }
}

function printHeader(msg) {
  console.log('\n=== ' + msg + ' ===');
}

async function main() {
  const repoRoot = process.cwd();
  const vercelFiles = findVercelFiles(repoRoot);
  const allFiles = walk(repoRoot);

  const errors = [];
  const warnings = [];

  if (vercelFiles.length === 0) {
    warnings.push('No vercel.json found in repository (may be fine for non-Vercel projects).');
  }

  for (const vf of vercelFiles) {
    const cfg = loadJsonSafe(vf);
    if (!cfg) {
      errors.push(`Cannot parse ${rel(vf, repoRoot)}`);
      continue;
    }
    const rootDir = path.dirname(vf);
    const filesInRoot = walk(rootDir).map((f) => rel(f, rootDir));

    // functions pattern checks
    if (cfg.functions && typeof cfg.functions === 'object') {
      for (const pattern of Object.keys(cfg.functions)) {
        const regex = patternToRegex(pattern);
        const matches = filesInRoot.filter((p) => regex.test(p));
        if (matches.length === 0) {
          errors.push(`${rel(vf, repoRoot)}: functions pattern "${pattern}" matched no files under ${rel(rootDir, repoRoot)}`);
        }
      }
    }

    // rewrites: warn about global rewrite to /api
    if (Array.isArray(cfg.rewrites)) {
      for (const r of cfg.rewrites) {
        if (r && r.source === '/(.*)' && typeof r.destination === 'string' && r.destination.startsWith('/api')) {
          warnings.push(`${rel(vf, repoRoot)}: rewrite from '/(.*)' to '${r.destination}' will send all requests to functions — verify this is intentional`);
        }
      }
    }

    // Check for HTML files not inside public or dist
    const htmlFiles = filesInRoot.filter((p) => p.endsWith('.html') && !p.startsWith('public/') && !p.startsWith('dist/'));
    for (const h of htmlFiles) {
      if (path.basename(h) !== 'index.html') {
        warnings.push(`${rel(vf, repoRoot)}: HTML file '${h}' is not in 'public/' or 'dist/' — move static HTML to public or configure your build (Vite) to include it`);
      }
    }

    // Check for __dirname usage in server files under api/server folders
    const serverCandidates = filesInRoot.filter((p) => /(^|\/)api(\/|$)|(^|\/)server(\/|$)/.test(p) || p.endsWith('.js') || p.endsWith('.ts'));
    for (const fRel of serverCandidates) {
      const full = path.join(rootDir, fRel);
      let content = '';
      try {
        content = fs.readFileSync(full, 'utf8');
      } catch (err) {
        continue;
      }
      if (content.includes('__dirname') && /\.\.\//.test(content)) {
        warnings.push(`${rel(vf, repoRoot)}: file '${fRel}' uses __dirname with relative paths – can break in serverless bundles`);
      }
      if (/path\.join\(\s*__dirname/.test(content)) {
        warnings.push(`${rel(vf, repoRoot)}: file '${fRel}' calls path.join(__dirname, ...) – prefer process.cwd() or includeFiles in vercel.json`);
      }
    }
  }

  // Generic checks for common front-end projects (vite)
  const viteConfigPaths = allFiles.filter((f) => /vite\.config(\.ts|\.js)?$/.test(f));
  for (const vc of viteConfigPaths) {
    const rootDir = path.dirname(vc);
    // Warn if no public/ folder exists
    if (!fs.existsSync(path.join(rootDir, 'public'))) {
      warnings.push(`${rel(vc, repoRoot)}: Vite config found but no 'public/' folder present under ${rel(rootDir, repoRoot)} — static HTML/assets should go into public/ or be added to rollup input.`);
    }
  }

  // Check package.json for build script in any folders that contain package.json
  const pkgFiles = allFiles.filter((f) => path.basename(f) === 'package.json');
  for (const pf of pkgFiles) {
    const pkg = loadJsonSafe(pf);
    if (!pkg) continue;
    const hasBuild = pkg.scripts && pkg.scripts.build;
    if (!hasBuild) {
      warnings.push(`${rel(pf, repoRoot)}: package.json has no 'build' script defined`);
    }
  }

  // Summarize
  printHeader('Production Structure Check Summary');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('No issues found.');
    process.exit(0);
  }
  if (errors.length > 0) {
    console.error('\nErrors:');
    for (const e of errors) console.error('- ' + e);
  }
  if (warnings.length > 0) {
    console.warn('\nWarnings:');
    for (const w of warnings) console.warn('- ' + w);
  }

  if (errors.length > 0) process.exit(2);
  process.exit(0);
}

main();
