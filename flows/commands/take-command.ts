import { CmdParams, Soul } from '../../types';

export function takeCmd({ gameState, targetTree, cmd }: CmdParams) {
  var items: Array<Soul> = cmd.targets;

  if (items) {
    cmd.actor.items = cmd.actor.items.concat(items);
    gameState.soulTracker.removeSouls(targetTree, items);
  } else {
    throw new Error('Somehow no item to take.');
  }
}
