var timer = require('d3-timer').timer;
// TODO: Seeded random id?
var randomId = require('idmaker').randomId;
var { removeFromArray } = require('../../tasks/array-ops');

import { GameState, Done, AnimationDef } from '../../types';

// None of these do the actual drawing. They just set up things in the gameState
// to be drawn, and they schedule extra draw calls.
export function animateBlast(animation: AnimationDef, gameState: GameState, draw, done: Done) {
  var blast = {
    id: randomId(4),
    cx: animation.custom.cx,
    cy: animation.custom.cy,
    r: 1,
    color: animation.custom.color
  };
  gameState.ephemerals.blasts.push(blast);
  var t = timer(updateBlast);

  function updateBlast(elapsed) {
    if (elapsed > animation.duration) {
      t.stop();
      removeFromArray(gameState.ephemerals.blasts, blast.id);
      done(null);
    } else {
      // Needs to get to max radius a little early.
      blast.r = elapsed / (animation.duration * 0.8) * animation.custom.r;
      if (blast.r > animation.custom.r) {
        blast.r = animation.custom.r;
      }
      draw();
    }
  }
}
