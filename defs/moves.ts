import { ColRow, MoveParams, MoveFn } from '../types';
import { getBoxAroundPosition } from '../tasks/get-box-around-position';

export function RandomMove({ avoid }: { avoid: Array<string> }): MoveFn {
  return randomMove;

  function randomMove({
    soul,
    probable,
    neighbors,
    getTargetsInBox
  }: MoveParams): ColRow {
    // Assuming we're being passed the right neighbors,
    // calculated keeping the soul's sprite size in mind.
    if (!avoid) {
      return probable.pickFromArray(neighbors);
    }
    // TODO: Do this less stupidly.
    var unoccupiedNeighbors = neighbors.filter(isUnoccupied);
    return probable.pickFromArray(unoccupiedNeighbors);

    function isUnoccupied(neighbor: ColRow) {
      // TODO: Filter for kind of thing to avoid.
      var box = getBoxAroundPosition({
        position: neighbor,
        boxWidth: soul.sprite.width,
        boxHeight: soul.sprite.height
      });
      var targets = getTargetsInBox({ box, filter: considerOccupied });
      return targets.length < 1;
    }
  }

  // Ignore grid tiles when considering if a space
  // is occupied.
  function considerOccupied(thing) {
    return !thing.gridId;
  }
}
