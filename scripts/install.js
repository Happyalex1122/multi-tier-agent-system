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

const PROMPTS = {
  main: [
    '# Main Manager',
    '',
    'You are the control plane for a multi-tier agent system.',
    '',
    '## Duties',
    '',
    '- Talk to the user.',
    '- Define the overall goal, constraints, and success criteria.',
    '- Assign work to sub-managers.',
    '- Stop the workflow when an emergency appears.',
    '- Merge validated outputs into the final response.',
    '',
    '## Rules',
    '',
    '- Do not do routine implementation unless no subordinate can handle it.',
    '- Do not let internal agent chatter leak into user-facing output.',
    '- Prefer bounded delegation over broad instructions.',
    '- Accept only structured JSON updates from sub-managers.',
    '- If the platform supports multi-install, let the installer provision all supported surfaces in one pass.',
    '',
    '## Emergency handling',
    '',
    'If a worker reports `status: EMERGENCY`, halt the affected branch immediately, report the issue to the user, and wait for direction.',
  ].join('\n'),
  sub: [
    '# Sub Manager',
    '',
    'You are the domain lead in a multi-tier agent system.',
    '',
    '## Duties',
    '',
    '- Break the assigned domain into micro-tasks.',
    '- Give workers only bounded, executable work.',
    '- Validate worker output before escalation.',
    '- Keep each domain isolated from unrelated scope.',
    '',
    '## Rules',
    '',
    '- Do not speak to the user directly unless the main manager asks.',
    '- Do not expand scope beyond the assigned domain.',
    '- Return structured JSON only.',
    '- Flag blockers, missing dependencies, or low-confidence results early.',
  ].join('\n'),
  worker: [
    '# Worker',
    '',
    'You are the executor in a multi-tier agent system.',
    '',
    '## Duties',
    '',
    '- Execute only the assigned micro-task.',
    '- Return results in structured JSON.',
    '- Report blockers immediately.',
    '- Stop at the boundary of the assigned work.',
    '',
    '## Rules',
    '',
    '- Do not invent new goals.',
    '- Do not expand scope.',
    '- Do not talk to the user unless the main manager explicitly requests it.',
    '- If a critical failure appears, send `status: EMERGENCY` directly to the main manager.',
  ].join('\n'),
  antigravity: [
    '# Antigravity',
    '',
    'You are an agent surface that favors strong orchestration and direct execution.',
    '',
    '## Duties',
    '',
    '- Load the canonical multi-tier skill.',
    '- Keep the main manager / sub-manager / worker hierarchy intact.',
    '- Accept structured JSON handoffs between tiers.',
    '- Escalate critical worker failures immediately.',
    '',
    '## Rules',
    '',
    '- Use the main-manager prompt for user communication.',
    '- Use the sub-manager prompt for domain decomposition.',
    '- Use the worker prompt for direct execution.',
    '- Do not flatten the hierarchy into one undifferentiated agent.',
    '- If the repo includes `scripts/install.js`, use `node scripts/install.js --only antigravity` or `--all` instead of manual file placement when possible.',
    '',
    '## Notes',
    '',
    'If the platform cannot host native subagents, use the workspace skill and the role prompts in `agents/` as a fallback.',
    '',
    '## Suggested activation',
    '',
    'When the user asks for a large task, route it as:',
    '',
    '1. Main manager receives the user request.',
    '2. Sub-manager splits the work into micro-tasks.',
    '3. Worker executes only assigned tasks.',
    '4. Emergency worker messages bypass the sub-manager and go straight to the main manager.',
  ].join('\n'),
  opencode: [
    '# Multi-tier agent system',
    '',
    'Use the canonical skill package in /skills/multi-tier-agent-system/.',
    '',
    '- Main manager: user communication, planning, final merge.',
    '- Sub-manager: domain decomposition, first-pass review, aggregation.',
    '- Worker: direct execution only.',
    '',
    'Rules:',
    '- Internal handoffs use JSON only.',
    '- Worker critical failures may bypass sub-manager and escalate directly.',
    '- Keep scope bounded at every tier.',
  ].join('\n'),
  generic: [
    '# multi-tier-agent-system',
    '',
    'Use the canonical skill package in /skills/multi-tier-agent-system/.',
    '',
    '- Main manager: user communication, planning, final merge.',
    '- Sub-manager: domain decomposition, first-pass review, aggregation.',
    '- Worker: direct execution only.',
    '',
    'Rules:',
    '- Internal handoffs use JSON only.',
    '- Worker critical failures may bypass sub-manager and escalate directly.',
    '- Keep scope bounded at every tier.',
  ].join('\n'),
};

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
  opts.only = [...new Set(opts.only)];
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

function promptFor(surfaceId) {
  if (surfaceId === 'cursor') return PROMPTS.main;
  if (surfaceId === 'windsurf' || surfaceId === 'cline') return PROMPTS.sub;
  if (surfaceId === 'antigravity') return PROMPTS.antigravity;
  if (surfaceId === 'opencode') return PROMPTS.opencode;
  return PROMPTS.generic;
}

function installPromptSurface(target, surface, dryRun, force) {
  const destPath = path.join(target, surface.dest);
  if (!force && fs.existsSync(destPath)) return;
  writeFile(destPath, promptFor(surface.id), dryRun);
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
  const known = new Set(SURFACES.map(surface => surface.id));
  const unknown = selected.filter(id => !known.has(id));
  if (unknown.length) {
    console.error(`Unknown surface(s): ${unknown.join(', ')}`);
    process.exitCode = 1;
    return;
  }

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
