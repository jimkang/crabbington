var spriteSheet = document.getElementById('sprite-sheet');
const spriteBlockSize = 128;

function renderSoul({ imageContext, transform }, soul) {
  imageContext.drawImage(
    spriteSheet,
    soul.sprite.col * spriteBlockSize,
    soul.sprite.row * spriteBlockSize,
    soul.sprite.width,
    soul.sprite.height,
    transform.applyX(soul.x) - soul.sprite.width / 2,
    transform.applyY(soul.y) - soul.sprite.height / 2,
    soul.sprite.width,
    soul.sprite.height
  );
}

module.exports = renderSoul;
