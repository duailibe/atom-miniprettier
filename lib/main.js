'use babel';

const { CompositeDisposable } = require('atom');

const runPrettier = require('./run-prettier');

function addErrorNotification(error) {
  if (!error || !error.codeFrame) throw error;
  atom.notifications.addError('Prettier failed', {
    stack: error.stack,
    detail: error.message
  });
}

function format(editor) {
  const filepath = editor.getPath();
  if (!filepath) return;

  const buffer = editor.getBuffer();
  const oldPos = editor.getCursorBufferPosition();
  const text = editor.getText();

  let result;

  try {
    result = runPrettier(text, {
      filepath,
      cursorOffset: buffer.characterIndexForPosition(oldPos)
    });
  } catch (error) {
    addErrorNotification(error);
    return;
  }

  if (text === result.formatted) return;

  buffer.setTextViaDiff(result.formatted);
  editor.setCursorBufferPosition(
    isNaN(result.cursorOffset)
      ? oldPos
      : buffer.positionForCharacterIndex(result.cursorOffset)
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
