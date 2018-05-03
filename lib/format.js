const fs = require('fs');
const path = require('path');

function ppath(dirpath) {
  return path.join(dirpath, 'node_modules', 'prettier', 'index.js');
}

function getOwnPrettierPath(filepath) {
  const dir = atom.project.getDirectories().find(dir => dir.contains(filepath));

  const path = ppath(dir.getPath());
  if (fs.existsSync(path)) {
    return path;
  }
}

module.exports = function(filepath, text, cursorOffset) {
  const ownPrettierPath = getOwnPrettierPath(filepath);
  const prettier = require(ownPrettierPath || path.dirname(__dirname));

  let prettierOptions = atom.config.get('miniprettier.options', {});
  if (ownPrettierPath) {
    prettierOptions = prettier.resolveConfig.sync(filepath) || {};
  }

  return prettier.formatWithCursor(
    text,
    Object.assign(prettierOptions, { filepath, cursorOffset })
  );
};
