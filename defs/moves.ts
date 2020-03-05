import { ColRow, MoveParams } from '../types';

export function randomMove({
  //soul,
  probable,
  neighbors,
  getTargetsAtColRow,
  canMoveHereFn
}: MoveParams): ColRow {
  var visitableNeigbors = neighbors.filter(isVisitable);
  return probable.pickFromArray(visitableNeigbors);

  function isVisitable(colRow: ColRow) {
    return canMoveHereFn({ getTargetsAtColRow, colRow });
  }
}
