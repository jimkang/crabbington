import { Box, Done, CmdParams, Filter, Soul } from '../../types';

export function blastCmd(
  { gameState, targetTree, removeSouls, cmd }: CmdParams,
  doneWithAnimationCompletionCallback: Done
) {
  // This probably should be based on something other than the sprite size.
  var blastBox: Box = {
    minX: cmd.actor.x - 3 * cmd.actor.sprite.width,
    maxX: cmd.actor.x + 3 * cmd.actor.sprite.width,
    minY: cmd.actor.y - 3 * cmd.actor.sprite.height,
    maxY: cmd.actor.y + 3 * cmd.actor.sprite.height
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
      cx: cmd.actor.x,
      cy: cmd.actor.y,
      r: 3 * cmd.actor.sprite.width,
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
