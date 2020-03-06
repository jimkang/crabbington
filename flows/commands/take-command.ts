var callNextTick = require('call-next-tick');

import { Done, CmdParams, Soul } from '../../types';
import { getLastClickedSoul } from '../../tasks/game-state-ops';

export function takeCmd({ gameState, removeSouls }: CmdParams, done: Done) {
  var item: Soul = getLastClickedSoul(gameState);

  if (item) {
    gameState.player.items.push(item);
    removeSouls(gameState, [item]);
  } else {
    throw new Error('Somehow no item to take.');
  }
  callNextTick(done);
}
