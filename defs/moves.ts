import { ColRow, MoveParams, MoveFn, MoveDef } from '../types';

// Singleton.
var cachedMoveFns: Record<string, MoveFn> = {};

export function getMoveFn(def: MoveDef): MoveFn {
  var moveFnId: string = getMoveFnId(def);
  var moveFn: MoveFn = cachedMoveFns[moveFnId];
  if (!moveFn) {
    // TODO: Other kinds of ctors.
    moveFn = RandomMove(def);
    cachedMoveFns[moveFnId] = moveFn;
  }
  return moveFn;
}

function RandomMove({ avoid }: MoveDef): MoveFn {
  return randomMove;

  function randomMove({
    probable,
    neighbors,
    getTargetsAtColRow
  }: MoveParams): ColRow {
    // Assuming we're being passed the right neighbors,
    // calculated keeping the soul's sprite size in mind.
    //if (!avoidAll && avoid.length < 1) {
    if (avoid.length < 1) {
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
    //if (avoidAll) {
    //return true;
    //}
    if (avoid && thing.categories && avoid.find(isInCategories)) {
      return true;
    }

    return false;

    function isInCategories(avoidCategory) {
      return thing.categories.includes(avoidCategory);
    }
  }
}

function getMoveFnId(def: MoveDef) {
  return `movefn-${def.avoid.join('_')}`;
}
