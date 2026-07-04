#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'multi-tier-agent-system');
const OPENCLAW_BOOTSTRAP = path.join(SKILL_ROOT, 'references', 'openclaw-bootstrap.md');

const SURFACES = [
  { id: 'codex', kind: 'skill', dest: path.join('.codex', 'skills', 'multi-tier-agent-system') },
  { id: 'claude', kind: 'skill', dest: path.join('.claude', 'skills', 'multi-tier-agent-system') },
  { id: 'antigravity', kind: 'skill', dest: path.join('.antigravity', 'skills', 'multi-tier-agent-system') },
  { id: 'cursor', kind: 'prompt', dest: path.join('.cursor', 'rules', 'multi-tier-agent-system.mdc') },
  { id: 'windsurf', kind: 'prompt', dest: path.join('.windsurf', 'rules', 'multi-tier-agent-system.md') },
  { id: 'cline', kind: 'prompt', dest: path.join('.clinerules', 'multi-tier-agent-system.md') },
  { id: 'copilot', kind: 'prompt', dest: path.join('.github', 'copilot-instructions.md') },
  { id: 'opencode', kind: 'prompt', dest: path.join('.opencode', 'AGENTS.md') },
  { id: 'agents', kind: 'prompt', dest: 'AGENTS.md' },
  { id: 'openclaw', kind: 'openclaw' },
];

const ROLE_PROMPT = `# multi-tier-agent-system

Use the canonical skill package in /skills/multi-tier-agent-system/.

- Main manager: user communication, planning, final merge.
- Sub-manager: domain decomposition, first-pass review, aggregation.
- Worker: direct execution only.

Rules:
- Internal handoffs use JSON only.
- Worker critical failures may bypass sub-manager and escalate directly.
- Keep scope bounded at every tier.
`;

function parseArgs(argv) {
  const opts = { target: process.cwd(), dryRun: false, force: false, only: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--target') opts.target = path.resolve(argv[++i]);
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--force') opts.force = true;
    else if (arg === '--only') opts.only.push(argv[++i]);
    else if (arg === '--all') opts.only = SURFACES.map(surface => surface.id);
    else if (arg === '--help' || arg === '-h') opts.help = true;
  }
  return opts;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function ensureDir(dir, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(targetPath, content, dryRun) {
  ensureDir(path.dirname(targetPath), dryRun);
  if (dryRun) return;
  fs.writeFileSync(targetPath, content, 'utf8');
}

function copyTree(srcDir, destDir, dryRun, force) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  ensureDir(destDir, dryRun);
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dst = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyTree(src, dst, dryRun, force);
      continue;
    }
    if (!force && fs.existsSync(dst)) continue;
    writeFile(dst, read(src), dryRun);
  }
}

function installSkillSurface(target, surface, dryRun, force) {
  const destRoot = path.join(target, surface.dest);
  copyTree(SKILL_ROOT, destRoot, dryRun, force);
}

function installPromptSurface(target, surface, dryRun, force) {
  const destPath = path.join(target, surface.dest);
  if (!force && fs.existsSync(destPath)) return;
  writeFile(destPath, ROLE_PROMPT, dryRun);
}

function installOpenClaw(target, dryRun, force) {
  const workspaceRoot = path.join(target, '.openclaw', 'workspace');
  installSkillSurface(workspaceRoot, { dest: path.join('skills', 'multi-tier-agent-system') }, dryRun, force);

  const soulPath = path.join(workspaceRoot, 'SOUL.md');
  const block = read(OPENCLAW_BOOTSTRAP).trimEnd() + '\n';
  const existing = fs.existsSync(soulPath) ? read(soulPath) : '';
  if (!existing.includes('multi-tier-agent-system-begin')) {
    const next = existing.endsWith('\n') || !existing ? existing + block : existing + '\n' + block;
    writeFile(soulPath, next, dryRun);
  }
}

function help() {
  console.log(`multi-tier-agent-system installer

Usage:
  node scripts/install.js [--target <dir>] [--all] [--only <agent>] [--dry-run] [--force]

Supported surfaces:
  ${SURFACES.map(surface => surface.id).join(', ')}

Examples:
  node scripts/install.js --all
  node scripts/install.js --only codex --only openclaw
  node scripts/install.js --target ./my-repo --all
`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return help();

  const selected = opts.only.length ? opts.only : SURFACES.map(surface => surface.id);
  for (const id of selected) {
    const surface = SURFACES.find(item => item.id === id);
    if (!surface) continue;
    if (surface.kind === 'skill') installSkillSurface(opts.target, surface, opts.dryRun, opts.force);
    else if (surface.kind === 'prompt') installPromptSurface(opts.target, surface, opts.dryRun, opts.force);
    else if (surface.kind === 'openclaw') installOpenClaw(opts.target, opts.dryRun, opts.force);
  }

  console.log(`Installed for: ${selected.join(', ')}` + (opts.dryRun ? ' (dry run)' : ''));
}

main();
