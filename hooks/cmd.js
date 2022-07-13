const cp = require('child_process');
const p = (_) => {
  const [h, ...p] = String.raw(..._).split(' ');
  return [h, p];
};

/** @returns {Promise<number?>} */
const $ = (..._) => new Promise((r) => cp.spawn(...p(_), { stdio: 'inherit' }).once('exit', r));

module.exports = $;
