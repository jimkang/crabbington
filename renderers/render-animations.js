var queue = require('d3-queue').queue;
var timer = require('d3-timer').timer;
var randomId = require('idmaker').randomId;
var callNextTick = require('call-next-tick');

var animationProcsForTypes = {
  blast: animateBlast
};

function renderAnimations({ gameState, onAdvance, draw }) {
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

// None of these do the actual drawing. They just set up things in the gameState
// to be drawn, and they schedule extra draw calls.
function animateBlast(animation, gameState, draw, done) {
  var blast = {
    id: randomId(4),
    cx: animation.cx,
    cy: animation.cy,
    r: 1,
    color: 'yellow'
  };
  gameState.ephemerals.blasts.push(blast);
  var t = timer(updateBlast);

  function updateBlast(elapsed) {
    console.log('elapsed', elapsed);
    if (elapsed > animation.duration) {
      t.stop();
      removeFromArray(gameState.ephemerals.blasts, blast.id);
      done();
    } else {
      // Needs to get to max radius a little early.
      blast.r = elapsed / (animation.duration * 0.8) * animation.r;
      if (blast.r > animation.r) {
        blast.r = animation.r;
      }
      draw();
    }
  }
}

function removeFromArray(array, id) {
  for (var i = array.length - 1; i >= 0; --i) {
    if (array[i].id === id) {
      array.splice(i, 1);
      break;
    }
  }
}

module.exports = renderAnimations;
