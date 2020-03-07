function removeFromArray(array, id) {
  for (var i = array.length - 1; i >= 0; --i) {
    if (array[i].id === id) {
      array.splice(i, 1);
      break;
    }
  }
}

module.exports = { removeFromArray };
