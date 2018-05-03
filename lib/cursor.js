const { Point } = require('atom');

module.exports = {
  pointToIndex(text, { row, column }) {
    let index = 0;
    while (row-- > 0) {
      index = text.indexOf('\n', index) + 1;
    }
    return index + column;
  },

  indexToPoint(text, index) {
    const column = index - (text.lastIndexOf('\n', index) + 1);
    let row = 0;
    while ((index = text.lastIndexOf('\n', index) - 1) > -1) {
      row++;
    }
    return new Point(row, column);
  }
};
