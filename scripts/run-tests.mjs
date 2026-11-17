import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Avoid shell wildcard expansion differences between macOS and Windows.
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = new URL('../tests/', import.meta.url);
const files = (await readdir(directory)).filter(file => file.endsWith('.test.mjs')).sort()
  .map(file => fileURLToPath(new URL(file, directory)));
if (!files.length) throw new Error('No test files found');
const result = spawnSync(process.execPath, ['--test', ...files], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
