import { Soul, GameState, TargetTree } from '../types';
import { dropItems } from './item-ops';

var curry = require('lodash.curry');

export function killSouls(
  gameState: GameState,
  targetTree: TargetTree,
  souls: Array<Soul>
): void {
  souls.forEach(curry(dropItems)(gameState, targetTree));
  gameState.soulTracker.removeSouls(targetTree, souls);
}
