import { CmdParams, Soul } from '../../types';
var findWhere = require('lodash.findwhere');

export function sleepCmd({ gameState, targetTree, cmd }: CmdParams) {
  if (cmd.actor.hp < cmd.actor.maxHP) {
    cmd.actor.hp += 1;
  }
  gameState.displayMessage = 'You are sleeping.';
}
