'use babel';

const { CompositeDisposable } = require('atom');
const path = require('path');
const fs = require('fs');

const cursor = require('./cursor');

function ppath(dir) {
  return path.join(dir, 'node_modules', 'prettier', 'index.js');
}

function getPrettier(editor) {
  const dir = atom.project
    .getDirectories()
    .find(dir => dir.contains(editor.getPath()));

  let filePath = ppath(dir.getPath());
  if (fs.existsSync(filePath)) {
    return require(filePath);
  }

  return require(path.dirname(__dirname));
}

function format(editor) {
  const prettier = getPrettier(editor);
  const options =
    prettier.resolveConfig.sync(editor.getPath()) ||
    atom.config.get('miniprettier.options', {});
  const pos = editor.getCursorBufferPosition();
  const text = editor.getText();

  const { formatted, cursorOffset } = prettier.formatWithCursor(
    text,
    Object.assign(options, { cursorOffset: cursor.getIndex(text, pos) })
  );
  editor.setText(formatted);
  editor.setCursorBufferPosition(
    isNaN(cursorOffset) ? pos : cursor.getPoint(formatted, cursorOffset)
  );
}

module.exports = {
  activate(state) {
    this.disposables = new CompositeDisposable(
      atom.commands.add('atom-text-editor:not([mini])', {
        'miniprettier:format'() {
          format(this.getModel());
        }
      })
    );
  },

  deactivate() {
    this.disposables.dispose();
  }
};
