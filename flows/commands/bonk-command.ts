import { Done, CmdParams, Soul } from '../../types';

export function bonkCmd(
  { gameState, removeSouls, cmd }: CmdParams,
  doneWithAnimationCompletionCallback: Done
) {
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
      removeSouls(gameState, [target]);
    }
    doneWithAnimationCompletionCallback(null, notifyAnimationDone);
  }
}
