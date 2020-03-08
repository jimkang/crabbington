var updateGrid = require('./update-grid');
var curry = require('lodash.curry');

import { GameState, TargetTree } from '../types';

export function init(gameState: GameState, targetTree: TargetTree) {
  if (!gameState.gridsInit) {
    gameState.grids.forEach(curry(updateGrid)(targetTree));
    gameState.gridsInit = true;
  }
}
