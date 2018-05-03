'use babel';

const { CompositeDisposable } = require('atom');

const cursor = require('./cursor');
const format = require('./format');

module.exports = {
  activate(state) {
    this.disposables = new CompositeDisposable(
      atom.commands.add('atom-text-editor:not([mini])', {
        'miniprettier:format'() {
          const editor = this.getModel();
          const oldPos = editor.getCursorBufferPosition();
          const text = editor.getText();

          const { formatted, cursorOffset } = format(
            editor.getPath(),
            text,
            cursor.pointToIndex(text, oldPos)
          );
          if (formatted !== text) {
            editor.setText(formatted);
            editor.setCursorBufferPosition(
              isNaN(cursorOffset)
                ? oldPos
                : cursor.indexToPoint(formatted, cursorOffset)
            );
          }
        }
      })
    );
  },

  deactivate() {
    this.disposables.dispose();
  }
};
