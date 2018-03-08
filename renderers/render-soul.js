var spriteSheet = document.getElementById('sprite-sheet');
const spriteBlockSize = 32;

function renderSoul({ imageContext }, soul) {
  imageContext.drawImage(
    spriteSheet,
    soul.sprite.col * spriteBlockSize,
    soul.sprite.row * spriteBlockSize,
    soul.sprite.width,
    soul.sprite.height,
    soul.minX,
    soul.minY,
    soul.sprite.width,
    soul.sprite.height
  );
}

module.exports = renderSoul;
