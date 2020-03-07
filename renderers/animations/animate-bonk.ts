var timer = require('d3-timer').timer;
var ease = require('d3-ease');
var math = require('basic-2d-math');

import { GameState, AnimationDef, Done, Soul, Pt } from '../../types';

export function animateBonk(animation: AnimationDef, gameState: GameState, draw, done: Done) {
  var bonker: Soul = animation.custom.bonkerSoul;
  var bonkee: Soul = animation.custom.bonkeeSoul;

  const origX: number = bonker.x;
  const origY: number = bonker.y;
  const destX: number = bonkee.x;
  const destY: number = bonkee.y;

  const xDist: number = destX - origX;
  const yDist: number = destY - origY;

  const halfDuration: number = animation.duration/2;

  bonker.facing = math.subtractPairs([destX, destY], [origX, origY]).map(limitTo1);
  var t = timer(updateBonk);

  function updateBonk(elapsed) {
    if (elapsed > animation.duration) {
      t.stop();
      bonker.x = origX;
      bonker.y = origY;
      done(null);
    } else {
      // Move over to the bonkee, then move back.
      const direction = (elapsed > halfDuration) ? -1 : 1;
      let t: number = (elapsed % halfDuration)/halfDuration;
      if (direction === -1) {
        // When we come back, we want to walk the curve
        // from right to left.
        t = 1 - t;
      }
      const proportion: number = ease.easeBackIn(t);
      const xDelta = (proportion * xDist);
      const yDelta = (proportion * yDist);
      console.log('t', t, 'proportion', proportion, 'xDelta', xDelta, 'yDelta', yDelta);
      bonker.x = origX + xDelta;
      bonker.y = origY + yDelta;
      draw();
    }
  }
}

function limitTo1(n: number) {
  if (n == 0) {
    return 0;
  } else if (n > 0) {
    return 1;
  } else {
    return -1;
  }
}
