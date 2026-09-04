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

  const filePath = (input.tool_input && input.tool_input.file_path) || '';
  const normalized = filePath.replace(/\\/g, '/');
  if (!normalized.includes('/src/')) process.exit(0);

  try {
    execSync('npm run lint', { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.error('[post-edit hook] lint failed');
  }
  try {
    execSync('npm test', { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.error('[post-edit hook] tests failed');
  }
  process.exit(0);
});
