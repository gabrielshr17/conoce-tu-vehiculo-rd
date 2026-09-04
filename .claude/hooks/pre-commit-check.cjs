const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

let data = '';
process.stdin.on('data', (c) => (data += c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(data);
  } catch {
    process.exit(0);
  }

  const command = (input.tool_input && input.tool_input.command) || '';
  if (!/\bgit\s+commit\b/.test(command)) process.exit(0);

  let failed = false;
  let reason = '';

  try {
    execSync('npm run lint', { cwd: ROOT, stdio: 'pipe' });
  } catch (e) {
    failed = true;
    reason += 'Lint failed:\n' + (e.stdout ? e.stdout.toString() : e.message) + '\n';
  }

  try {
    execSync('npm test', { cwd: ROOT, stdio: 'pipe' });
  } catch (e) {
    failed = true;
    reason += 'Tests failed:\n' + (e.stdout ? e.stdout.toString() : e.message) + '\n';
  }

  if (failed) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: reason.slice(0, 4000),
        },
      }),
    );
  }
  process.exit(0);
});
