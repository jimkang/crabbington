var findWhere = require('lodash.findwhere');

var spriteSheet = document.getElementById('sprite-sheet');
const spriteBlockSize = 32;

function renderSoul({ imageContext, inputContext, grids }, soul) {
  var grid = findWhere(grids, { id: soul.grid.id });
  if (!grid) {
    console.log('Could not find grid', soul.grid.id, 'for', soul.id, '!');
    return;
  }

  var intersection = grid.rows[soul.grid.row][soul.grid.col];
  var spriteLeft = intersection[0] - soul.sprite.width / 2;
  var spriteTop = intersection[1] - soul.sprite.height / 2;

  imageContext.drawImage(
    spriteSheet,
    soul.sprite.col * spriteBlockSize,
    soul.sprite.row * spriteBlockSize,
    soul.sprite.width,
    soul.sprite.height,
    spriteLeft,
    spriteTop,
    soul.sprite.width,
    soul.sprite.height
  );
}

module.exports = renderSoul;
