var updateGrid = require('./update-grid');
var updateSoul = require('./update-soul');
var curry = require('lodash.curry');

import { GameState, TargetTree } from '../types';

export function init(gameState: GameState, targetTree: TargetTree) {
  if (!gameState.gridsInit) {
    // It's important to call updateSoul during
    // init because it gets the souls into the targetTree.
    gameState.souls.forEach(curry(updateSoul)(gameState.grids, targetTree));
    gameState.grids.forEach(curry(updateGrid)(targetTree));
    gameState.gridsInit = true;
  }
}
