#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'multi-tier-agent-system');
const AGENTS_ROOT = path.join(REPO_ROOT, 'agents');
const OPENCLAW_BOOTSTRAP = path.join(SKILL_ROOT, 'references', 'openclaw-bootstrap.md');

const AGENTS = [
  { id: 'codex', type: 'skill', dest: path.join('.codex', 'skills', 'multi-tier-agent-system') },
  { id: 'claude', type: 'skill', dest: path.join('.claude', 'skills', 'multi-tier-agent-system') },
  { id: 'cursor', type: 'rule', dest: path.join('.cursor', 'rules', 'multi-tier-agent-system.mdc') },
  { id: 'windsurf', type: 'rule', dest: path.join('.windsurf', 'rules', 'multi-tier-agent-system.md') },
  { id: 'cline', type: 'rule', dest: path.join('.clinerules', 'multi-tier-agent-system.md') },
  { id: 'copilot', type: 'rule', dest: path.join('.github', 'copilot-instructions.md') },
  { id: 'opencode', type: 'rule', dest: path.join('.opencode', 'AGENTS.md') },
  { id: 'agents', type: 'rule', dest: 'AGENTS.md' },
  { id: 'openclaw', type: 'openclaw' },
];

function parseArgs(argv) {
  const opts = { target: process.cwd(), dryRun: false, force: false, only: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--target') opts.target = path.resolve(argv[++i]);
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--force') opts.force = true;
    else if (arg === '--only') opts.only.push(argv[++i]);
    else if (arg === '--all') opts.only = AGENTS.map(a => a.id);
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

function installSkill(target, dryRun, force) {
  const destDir = path.join(target, '.codex', 'skills', 'multi-tier-agent-system');
  const files = [
    ['SKILL.md', path.join(SKILL_ROOT, 'SKILL.md')],
    ['README.md', path.join(SKILL_ROOT, 'README.md')],
    [path.join('references', 'communication-schema.md'), path.join(SKILL_ROOT, 'references', 'communication-schema.md')],
    [path.join('references', 'escalation-protocol.md'), path.join(SKILL_ROOT, 'references', 'escalation-protocol.md')],
    [path.join('references', 'openclaw-bootstrap.md'), path.join(SKILL_ROOT, 'references', 'openclaw-bootstrap.md')],
  ];
  for (const [rel, src] of files) {
    const dst = path.join(destDir, rel);
    if (!force && fs.existsSync(dst)) continue;
    writeFile(dst, read(src), dryRun);
  }
}

function installAgent(agentId, target, dryRun, force) {
  const agent = AGENTS.find(a => a.id === agentId);
  if (!agent) return { ok: false, reason: `unknown agent: ${agentId}` };
  if (agent.type === 'skill') {
    installSkill(target, dryRun, force);
    return { ok: true, agentId };
  }
  if (agent.type === 'openclaw') {
    const soul = path.join(target, 'SOUL.md');
    const block = read(OPENCLAW_BOOTSTRAP).trimEnd() + '\n';
    const existing = fs.existsSync(soul) ? read(soul) : '';
    if (!existing.includes('multi-tier-agent-system-begin')) {
      const next = existing.endsWith('\n') || !existing ? existing + block : existing + '\n' + block;
      if (!dryRun) writeFile(soul, next, false);
    }
    return { ok: true, agentId };
  }

  const dest = path.join(target, agent.dest);
  const content = agent.id === 'copilot'
    ? `# Multi-tier agent system\n\nUse the role prompts in /agents and the canonical skill in /skills/multi-tier-agent-system.\n`
    : agent.id === 'opencode'
      ? `# Multi-tier agent system\n\nLoad the role prompts from /agents and keep JSON handoffs between tiers.\n`
      : read(path.join(AGENTS_ROOT, agent.id === 'cursor' ? 'worker.md' : agent.id === 'windsurf' ? 'sub-manager.md' : 'main-manager.md'));

  if (!force && fs.existsSync(dest)) return { ok: true, agentId, skipped: true };
  writeFile(dest, content, dryRun);
  return { ok: true, agentId };
}

function help() {
  console.log(`multi-tier-agent-system installer

Usage:
  node scripts/install.js [--target <dir>] [--all] [--only <agent>] [--dry-run] [--force]

Agents:
  ${AGENTS.map(a => a.id).join(', ')}

Examples:
  node scripts/install.js --all
  node scripts/install.js --only codex --only openclaw
  node scripts/install.js --target ~/projects/my-repo --all
`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return help();
  const wanted = opts.only.length ? opts.only : AGENTS.map(a => a.id);
  for (const id of wanted) installAgent(id, opts.target, opts.dryRun, opts.force);
  console.log(`Installed for: ${wanted.join(', ')}` + (opts.dryRun ? ' (dry run)' : ''));
}

main();
