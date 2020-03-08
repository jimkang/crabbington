import { CmdParams, Soul } from '../../types';
var findWhere = require('lodash.findwhere');

export function takeCmd({ gameState, targetTree, cmd }: CmdParams) {
  var items: Array<Soul> = cmd.targets;

  if (items) {
    cmd.actor.items = cmd.actor.items.concat(items);
    gameState.soulTracker.removeSouls(targetTree, items);

    if (findWhere(items, { id: 'player' })) {
      gameState.displayMessage = `Uh, oh! A ${cmd.actor.type} has taken you! I hope it drops you soon! (You can hit reload if are really not OK with this.)`;
    }
  } else {
    throw new Error('Somehow no item to take.');
  }
}
