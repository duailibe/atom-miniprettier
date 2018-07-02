const fs = require('fs');
const path = require('path');
const globalDir = path.resolve(require('global-modules'), '..');
const pluginDir = path.resolve(__dirname, '..');

module.exports = function(filepath, text, cursorOffset) {
  const { prettierPath, local } = findPrettier(filepath);
  const prettier = require(prettierPath);
  const options = local
    ? prettier.resolveConfig.sync(filepath)
    : atom.config.get('miniprettier.options');

  return prettier.formatWithCursor(
    text,
    Object.assign({}, options, { filepath, cursorOffset })
  );
};

function findPrettier(filepath) {
  let prettierPath;

  const local = getProjectPath(filepath);
  if ((prettierPath = exists(local))) {
    return { prettierPath, local: true };
  }

  return {
    prettierPath: exists(globalDir) || exists(pluginDir),
    local: false
  };

  function exists(dirpath) {
    const index = path.join(dirpath, 'node_modules', 'prettier', 'index.js');
    if (fs.existsSync(index)) {
      return index;
    }
  }
}

function getProjectPath(filepath) {
  return atom.project
    .getDirectories()
    .find(dir => dir.contains(filepath))
    .getPath();
}
