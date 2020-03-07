import { Done, CmdParams, Soul } from '../../types';
import { getLastClickedSoul } from '../../tasks/game-state-ops';

// TODO: Make this work symmetrically.
export function bonkCmd(
  { gameState, removeSouls }: CmdParams,
  doneWithAnimationCompletionCallback: Done
) {
  var soul: Soul = getLastClickedSoul(gameState);
  console.log('bonking:', soul.id);
  gameState.animations.push({
    type: 'bonk',
    custom: {
      bonkerSoul: gameState.player,
      bonkeeSoul: soul
    },
    duration: 900,
    postAnimationGameStateUpdater: updateStatePostBonkAnimation
  });

  function updateStatePostBonkAnimation(notifyAnimationDone: Done) {
    if (!isNaN(soul.hp)) {
      soul.hp -= 3;
      console.log('New hp for', soul.id, soul.hp, '/', soul.maxHP);
    }
    if (soul.hp < 1) {
      removeSouls(gameState, [soul]);
    }
    doneWithAnimationCompletionCallback(null, notifyAnimationDone);
  }
}
