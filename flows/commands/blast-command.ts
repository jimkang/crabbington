var callNextTick = require('call-next-tick');
import { Box, Done, CmdParams, Filter, Soul } from '../../types';

export function blastCmd({ gameState, targetTree, cmd }: CmdParams) {
  // This probably should be based on something other than the sprite size.
  var blastBox: Box = {
    minX: cmd.actor.x - cmd.params.blastSize * cmd.actor.sprite.width,
    maxX: cmd.actor.x + cmd.params.blastSize * cmd.actor.sprite.width,
    minY: cmd.actor.y - cmd.params.blastSize * cmd.actor.sprite.height,
    maxY: cmd.actor.y + cmd.params.blastSize * cmd.actor.sprite.height
  };
  var thingsToRemove = getTargetsInBox({
    targetTree,
    filter: isBlastable,
    box: blastBox
  });
  gameState.animations.push({
    type: 'blast',
    custom: {
      cx: cmd.actor.x,
      cy: cmd.actor.y,
      r: cmd.params.blastSize * cmd.actor.sprite.width,
      color: cmd.params.color
    },
    duration: 1000,
    postAnimationGameStateUpdater: updateStatePostBlastAnimation
  });

  function updateStatePostBlastAnimation(notifyAnimationDone: Done) {
    gameState.soulTracker.removeSouls(targetTree, thingsToRemove);
    callNextTick(notifyAnimationDone);
  }

  function isBlastable(thing) {
    // For now, only blast other souls.
    return thing.id !== cmd.actor.id;
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
