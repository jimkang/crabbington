import { Soul, Grid, ColRow } from '../types';

export function getNeighboringColRows(soul: Soul, grid: Grid): Array<ColRow> {
  var neighbors: Array<ColRow> = [
    [soul.gridContext.colRow[0] + 1, soul.gridContext.colRow[1]],
    [soul.gridContext.colRow[0], soul.gridContext.colRow[1] + 1],
    [soul.gridContext.colRow[0] - 1, soul.gridContext.colRow[1]],
    [soul.gridContext.colRow[0], soul.gridContext.colRow[1] - 1]
  ];
  return neighbors.filter(isInGridBounds);

  function isInGridBounds(neighbor: ColRow) {
    return (
      neighbor[0] >= 0 &&
      neighbor[0] < grid.rows[0].length &&
      neighbor[1] >= 0 &&
      neighbor[1] < grid.rows.length
    );
  }
}
