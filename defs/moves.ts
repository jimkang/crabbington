import { ColRow, MoveParams, MoveFn } from '../types';

export function RandomMove({
  avoidAll,
  avoid = []
}: {
  avoidAll?: boolean;
  avoid?: Array<string>;
}): MoveFn {
  return randomMove;

  function randomMove({
    probable,
    neighbors,
    getTargetsAtColRow
  }: MoveParams): ColRow {
    // Assuming we're being passed the right neighbors,
    // calculated keeping the soul's sprite size in mind.
    if (!avoidAll && avoid.length < 1) {
      return probable.pickFromArray(neighbors);
    }
    // TODO: Do this less stupidly.
    var unoccupiedNeighbors = neighbors.filter(isUnoccupied);
    return probable.pickFromArray(unoccupiedNeighbors);

    function isUnoccupied(neighbor: ColRow) {
      var targets = getTargetsAtColRow({ colRow: neighbor }).filter(
        considerOccupied
      );
      return targets.length < 1;
    }
  }

  // Ignore grid tiles when considering if a space
  // is occupied.
  function considerOccupied(thing) {
    if (thing.gridId) {
      return false;
    }
    if (avoidAll) {
      return true;
    }
    if (avoid && thing.category && avoid.includes(thing.category)) {
      return true;
    }

    return false;
  }
}
