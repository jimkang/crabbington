import { CmdParams, Soul, Done } from '../../types';
var callNextTick = require('call-next-tick');
import { killSouls } from '../../ops/kill-ops';

export function bonkCmd({ gameState, targetTree, cmd, probable }: CmdParams) {
  var target: Soul = cmd.targets[0];
  gameState.animations.push({
    type: 'bonk',
    custom: {
      bonkerSoul: cmd.actor,
      bonkeeSoul: target,
    },
    duration: 900,
    postAnimationGameStateUpdater: updateStatePostBonkAnimation,
  });

  function updateStatePostBonkAnimation(notifyAnimationDone: Done) {
    var damage = probable.rollDie(6);
    var killed: Soul[] = [];

    // Damage target's items before target.
    for (let i = target.items.length - 1; damage > 0 && i >= 0; --i) {
      let currentTarget = target.items[i];
      damage = damageSoul(killed, currentTarget, damage);
      if (damage >= 0) {
        target.items.splice(i, 1);
      }
    }

    // Damage target.
    if (damage > 0) {
      damageSoul(killed, target, damage);
    }

    gameState.soulTracker.removeSouls(targetTree, killed);
    killSouls(gameState, targetTree, killed);

    callNextTick(notifyAnimationDone);
  }

  // Returns remaining damage, if any.
  function damageSoul(
    recentlyDeceased: Soul[],
    target: Soul,
    damage: number
  ): number {
    if (!isNaN(target.hp)) {
      if (target.hp > damage) {
        target.hp -= damage;
        damage = 0;
      } else {
        // Order is important here!
        damage -= target.hp;
        target.hp = 0;
      }
      if (target.hp < 1) {
        recentlyDeceased.push(target);
      }
      console.log('New hp for', target.id, target.hp, '/', target.maxHP);
    }
    return damage;
  }
}
