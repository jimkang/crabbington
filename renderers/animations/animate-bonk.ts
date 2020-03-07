var timer = require('d3-timer').timer;
var ease = require('d3-ease');

import { GameState, AnimationDef, Done, Soul } from '../../types';

export function animateBonk(animation: AnimationDef, gameState: GameState, draw, done: Done) {
  var bonker: Soul = animation.custom.bonkerSoul;
  var bonkee: Soul = animation.custom.bonkeeSoul;

  const origX: number = bonker.x;
  const origY: number = bonker.y;

  const xDist: number = bonkee.x - bonker.x;
  const yDist: number = bonkee.y - bonker.y;
  const slope: number = yDist/xDist;

  var t = timer(updateBonk);

  function updateBonk(elapsed) {
    if (elapsed > animation.duration) {
      t.stop();
      bonker.x = origX;
      bonker.y = origY;
      done(null);
    } else {
      const t: number = elapsed/animation.duration;
      bonker.x = origX + ease.easeElasticInOut(t) * xDist;
      bonker.y = origY + bonker.x * slope;
      draw();
    }
  }
}
