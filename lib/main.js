'use babel';

const { CompositeDisposable } = require('atom');

const runPrettier = require('./run-prettier');

function format(editor) {
  const filepath = editor.getPath();
  if (!filepath) return;

  const buffer = editor.getBuffer();
  const oldPos = editor.getCursorBufferPosition();
  const text = editor.getText();

  const { formatted, cursorOffset } = runPrettier(text, {
    filepath,
    cursorOffset: buffer.characterIndexForPosition(oldPos)
  });

  buffer.setTextViaDiff(formatted);
  editor.setCursorBufferPosition(
    isNaN(cursorOffset)
      ? oldPos
      : buffer.positionForCharacterIndex(cursorOffset)
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
