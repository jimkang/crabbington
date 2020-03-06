var callNextTick = require('call-next-tick');

import { Done, CmdParams, Soul } from '../../types';

export function takeCmd({ gameState, removeSouls }: CmdParams, done: Done) {
  var item: Soul = gameState.souls.find(isALastClickedItem);
  if (item) {
    let thingsToRemove = [];
    gameState.player.items.push(item);
    thingsToRemove.push(item);
    removeSouls(gameState, thingsToRemove);
  } else {
    throw new Error('Somehow no item to take.');
  }
  callNextTick(done);

  function isALastClickedItem(soul: Soul) {
    return gameState.lastClickedThingIds.includes(soul.id);
  }
}
