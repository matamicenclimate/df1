/*
  Installs hooks locally.
*/
const fs = require('fs');
const path = require('path');

const HOOKS = ['pre-commit.js'];
const HOOK_DIR = path.join(__dirname, '..', '.git', 'hooks');

console.log(`About to install ${HOOKS.length}, make you sure that Node engine is already present.`);
for (const hook of HOOKS) {
  console.log(`Installing hook for ${hook}...`);
  const from = path.join(__dirname, hook);
  const to = path.join(HOOK_DIR, hook).replace(/\.js$/i, '');
  fs.copyFileSync(from, to);
}
