function flattenRowsButKeepOrigins(rows) {
  var flattened = [];
  for (var rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
    var row = rows[rowIndex];
    for (var colWithinRow = 0; colWithinRow < row.length; ++colWithinRow) {
      flattened.push({ rowIndex, colWithinRow, value: row[colWithinRow] });
    }
  }
  return flattened;
}

function reconstituteIntoRows(flatWrappedValueArray) {
  var rows = [];
  flatWrappedValueArray.forEach(addToRows);
  return rows;

  function addToRows(wrappedValue) {
    var row = [];
    if (Array.isArray(rows[wrappedValue.rowIndex])) {
      row = rows[wrappedValue.rowIndex];
    } else {
      rows[wrappedValue.rowIndex] = row;
    }
    row[wrappedValue.colWithinRow] = wrappedValue.value;
  }
}

module.exports = {
  flattenRowsButKeepOrigins,
  reconstituteIntoRows
};
