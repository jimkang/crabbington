var queue = require('d3-queue').queue;
var callNextTick = require('call-next-tick');

import { GameState } from '../types';
import { animateBlast } from './animations/animate-blast';
import { animateBonk } from './animations/animate-bonk';

var animationProcsForTypes = {
  blast: animateBlast,
  bonk: animateBonk
};

export function renderAnimations({ gameState, onAdvance, draw }: { gameState: GameState, onAdvance, draw }) {
  gameState.allowAdvance = false;
  var q = queue(1);
  gameState.animations.forEach(queueAnimation);
  q.awaitAll(resume);

  function queueAnimation(animation) {
    q.defer(runAnimation, animation);
  }

  function resume(error) {
    if (error) {
      console.error(error);
    }
    gameState.allowAdvance = true;
    gameState.animations.length = 0;
    onAdvance({ gameState });
  }

  function runAnimation(animation, done) {
    var proc = animationProcsForTypes[animation.type];
    if (proc) {
      proc(animation, gameState, draw, animationProcDone);
    } else {
      callNextTick(done);
    }
    function animationProcDone() {
      if (animation.postAnimationGameStateUpdater) {
        animation.postAnimationGameStateUpdater(done);
      }
    }
  }
}
