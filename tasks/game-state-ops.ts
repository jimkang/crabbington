import { GameState, Soul } from '../types';

export function getLastClickedSoul(gameState: GameState): Soul {
  return gameState.souls.find(isALastClickedItem);

  function isALastClickedItem(soul: Soul) {
    return gameState.lastClickedThingIds.includes(soul.id);
  }
}
