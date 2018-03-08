function applyToPointsInRows(rows, fn) {
  for (var rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
    let row = rows[rowIndex];
    for (var colIndex = 0; colIndex < row.length; ++colIndex) {
      fn(row[colIndex]);
    }
  }
}

module.exports = applyToPointsInRows;
