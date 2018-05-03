const { Point } = require('atom');

module.exports = {
  getIndex(text, { row, column }) {
    let idx = 0;
    while (row-- > 0) {
      const length = text.indexOf('\n') + 1;
      idx = idx + length;
      text = text.substring(length);
    }
    return idx + column;
  },

  getPoint(text, index) {
    let row = 0;
    while (true) {
      const length = text.indexOf('\n') + 1;
      if (length < index) {
        row++;
        index = index - length;
        text = text.substring(length);
      } else {
        return new Point(row, index);
      }
    }
  }
};
