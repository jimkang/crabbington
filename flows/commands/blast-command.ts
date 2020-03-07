import { Box, Done, CmdParams, Filter, Soul } from '../../types';

export function blastCmd(
  { gameState, targetTree, removeSouls }: CmdParams,
  doneWithAnimationCompletionCallback: Done
) {
  // This probably should be based on something other than the sprite size.
  var blastBox: Box = {
    minX: gameState.player.x - 3 * gameState.player.sprite.width,
    maxX: gameState.player.x + 3 * gameState.player.sprite.width,
    minY: gameState.player.y - 3 * gameState.player.sprite.height,
    maxY: gameState.player.y + 3 * gameState.player.sprite.height
  };
  var thingsToRemove = getTargetsInBox({
    targetTree,
    filter: isBlastable,
    box: blastBox
  });
  console.log('blasting:', thingsToRemove);
  gameState.animations.push({
    type: 'blast',
    custom: {
      cx: gameState.player.x,
      cy: gameState.player.y,
      r: 3 * gameState.player.sprite.width,
      color: 'yellow'
    },
    duration: 1000,
    postAnimationGameStateUpdater: updateStatePostBlastAnimation
  });

  function updateStatePostBlastAnimation(notifyAnimationDone: Done) {
    removeSouls(gameState, thingsToRemove);
    doneWithAnimationCompletionCallback(null, notifyAnimationDone);
  }
}

function getTargetsInBox({
  targetTree,
  box,
  filter
}: {
  targetTree;
  box: Box;
  filter?: Filter;
}): Array<Soul> {
  var targets = targetTree.search(box);
  // TODO: Further check that these are actually in a circle, rather than just
  // in a box circumscribing it.
  if (filter) {
    targets = targets.filter(filter);
  }
  return targets;
}

function isBlastable(thing) {
  // For now, only blast other souls.
  return thing.type && thing.type !== 'player';
}
