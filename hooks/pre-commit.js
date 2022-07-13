#!/usr/bin/node
/*
  This script represents a pre-commit hook.
  Installed via: install-hooks.js
*/
const $ = require('./cmd');

// Run commands:
$`npm run prettier`.then(() => $`npm run lint`);
