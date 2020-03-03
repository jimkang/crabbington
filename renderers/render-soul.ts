var spriteSheet = document.getElementById('sprite-sheet');
var isEqual = require('lodash.isequal');

import { spriteSize } from '../sizes';
import { Soul } from '../types';

function renderSoul(
  { imageContext, transform, baseX, baseY, facing },
  soul: Soul
) {
  // Is save expensive?
  imageContext.save();

  const x =
    transform.applyX(isNaN(baseX) ? soul.x : baseX) - soul.sprite.width / 2;
  const y =
    transform.applyY(isNaN(baseY) ? soul.y : baseY) - soul.sprite.height / 2;
  var localX = 0;
  var localY = 0;
  var facingDir = facing || soul.facing;

  imageContext.translate(x, y);
  // Sprites are assumed to face the right by default.
  if (isEqual(facingDir, [-1, 0])) {
    // Special case for facing left: Flip the sprite.
    imageContext.translate(soul.sprite.width, 0);
    imageContext.scale(-1, 1);
  } else {
    // When rotating, we need to put the center at the
    // center of the sprite but also draw the sprite
    // so that its center aligns with the center of the
    // current view (meaning the corner is going be half
    // a sprite to the left and top).
    // atan2 params are y, x not x, y.
    const angle: number = Math.atan2(facingDir[1], facingDir[0]);
    imageContext.translate(soul.sprite.width / 2, soul.sprite.height / 2);
    imageContext.rotate(angle);
    localX = -soul.sprite.width / 2;
    localY = -soul.sprite.height / 2;
  }

  imageContext.drawImage(
    spriteSheet,
    soul.sprite.col * spriteSize,
    soul.sprite.row * spriteSize,
    soul.sprite.width,
    soul.sprite.height,
    localX,
    localY,
    soul.sprite.width,
    soul.sprite.height
  );
  imageContext.restore();

  if (soul.items) {
    soul.items.forEach(renderItem);
  }

  function renderItem(item: Soul) {
    // TODO: Items that aren't visible.
    renderSoul(
      {
        imageContext,
        transform,
        baseX: soul.x,
        baseY: soul.y,
        facing: facingDir
      },
      item
    );
  }
}

module.exports = renderSoul;
