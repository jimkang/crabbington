var callNextTick = require('call-next-tick');

import { Done, CmdParams, Soul } from '../../types';

export function takeCmd(
  { gameState, removeSouls, cmd }: CmdParams,
  done: Done
) {
  var items: Array<Soul> = cmd.targets;

  if (items) {
    cmd.actor.items = cmd.actor.items.concat(items);
    removeSouls(gameState, items);
    callNextTick(done);
  } else {
    callNextTick(done, new Error('Somehow no item to take.'));
  }
}
