import { Soul, GameState, TargetTree } from '../types';

export function dropItems(
  gameState: GameState,
  targetTree: TargetTree,
  soul: Soul
): void {
  if (!soul.items) {
    return;
  }
  soul.items.forEach(setGridProps);
  gameState.soulTracker.addSouls(gameState.grids, targetTree, soul.items);
  soul.items.length = 0;

  function setGridProps(item: Soul) {
    item.gridContext.id = soul.gridContext.id;
    // TODO: In some cases, allow items to be dropped
    // at colRows other than the posessing soul's.
    item.gridContext.colRow = soul.gridContext.colRow;
  }
}
