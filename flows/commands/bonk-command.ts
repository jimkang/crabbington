import { CmdParams, Soul, Done } from '../../types';
var callNextTick = require('call-next-tick');

export function bonkCmd({ gameState, targetTree, cmd }: CmdParams) {
  var target: Soul = cmd.targets[0];
  gameState.animations.push({
    type: 'bonk',
    custom: {
      bonkerSoul: cmd.actor,
      bonkeeSoul: target
    },
    duration: 900,
    postAnimationGameStateUpdater: updateStatePostBonkAnimation
  });

  function updateStatePostBonkAnimation(notifyAnimationDone: Done) {
    if (!isNaN(target.hp)) {
      target.hp -= 3;
      console.log('New hp for', target.id, target.hp, '/', target.maxHP);
    }
    if (target.hp < 1) {
      gameState.soulTracker.removeSouls(targetTree, [target]);
    }
    callNextTick(notifyAnimationDone);
  }
}
