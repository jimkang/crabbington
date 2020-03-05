import { CanMoveHereParams, CanMoveHereFn, CanMoveHereDef } from '../types';

// Singleton.
var cachedCanMoveHereFns: Record<string, CanMoveHereFn> = {};

export function getCanMoveHereFn(def: CanMoveHereDef): CanMoveHereFn {
  var canMoveHereFnId: string = getCanMoveHereFnId(def);
  var canMoveHereFn: CanMoveHereFn = cachedCanMoveHereFns[canMoveHereFnId];
  if (!canMoveHereFn) {
    // TODO: Other kinds of ctors.
    canMoveHereFn = CanMoveHere(def);
    cachedCanMoveHereFns[canMoveHereFnId] = canMoveHereFn;
  }
  return canMoveHereFn;

  function CanMoveHere({ avoid }: CanMoveHereDef): CanMoveHereFn {
    return canMoveHere;

    function canMoveHere({
      colRow,
      getTargetsAtColRow
    }: CanMoveHereParams): boolean {
      var targets = getTargetsAtColRow({ colRow }).filter(considerOccupied);
      return targets.length < 1;
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
}

function getCanMoveHereFnId(def: CanMoveHereDef) {
  return `movefn-${def.avoid.join('_')}`;
}
