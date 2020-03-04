var math = require('basic-2d-math');

type Vector = [number, number];

// Mutates vectors.
export function sortVectorsByCloseness(
  target: Vector,
  vectors: Array<Vector>
): Array<Vector> {
  var indexSimTuples: Array<[number, number]> = vectors.map(simToTarget);
  indexSimTuples.sort(compareIndexSimTupleDesc);
  return indexSimTuples.map(getVectorForIndex);

  function simToTarget(vector: Vector, index: number): [number, number] {
    return [index, math.cosSim(vector, target)];
  }

  function getVectorForIndex(indexSimTuple: [number, number]): Vector {
    return vectors[indexSimTuple[0]];
  }
}

function compareIndexSimTupleDesc(a: [number, number], b: [number, number]) {
  if (a[1] > b[1]) {
    return -1;
  }
  return 1;
}
