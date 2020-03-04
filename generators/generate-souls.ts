var cloneDeep = require('lodash.clonedeep');
var curry = require('lodash.curry');
var pluck = require('lodash.pluck');
var flatten = require('lodash.flatten');
var RandomId = require('@jimkang/randomid');
var Probable = require('probable').createProbable;
var { Tablenest, r } = require('tablenest');

import { SoulDef, Soul, Pt, ColRow, Grid, GridIntersection } from '../types';
import { soulDefs } from '../defs/soul-defs';

// Sprites are assumed to face the right by default.
var facingDirections: Array<Pt> = [[1, 0], [0, -1], [-1, 0], [0, 1]];

var obstructionTypeTableDef = {
  root: [[1, 'pointyRock'], [1, 'roundRock'], [1, 'twoPointRock']]
};

// Add item from soul-defs macro (assuming it's open in
// the left pane and this is in the right): @i
var figureTypeTableDef = {
  root: [[2, r`guy`], [1, r`item`]],
  guy: [
    [1, 'bug'],
    [1, 'cat'],
    [1, 'cloud'],
    [1, 'corn'],
    [1, 'devil'],
    [1, 'SUV'],
    [1, 'tearDrop'],
    [1, 'trike'],
    [1, 'worm']
  ],
  item: [
    [1, 'avocado'],
    [1, 'basicShell'],
    [1, 'beanie'],
    [1, 'box'],
    [1, 'bucket'],
    [1, 'cup'],
    [1, 'fancyShell'],
    [1, 'helmet'],
    [1, 'horn'],
    [1, 'lagavulinShell'],
    [1, 'largeShell'],
    [1, 'longShell'],
    [1, 'pan'],
    [1, 'shoe'],
    [1, 'skull'],
    [1, 'soupCan'],
    [1, 'tinyShell'],
    [1, 'trilby'],
    [1, 'twistyShell']
  ]
};

function generateSouls({ random, grids }) {
  var probable = Probable({ random });
  var randomId = RandomId({ random });
  var tablenest = Tablenest({ random });

  var obstructionTypeTableRoll = tablenest(obstructionTypeTableDef);
  var figureTypeTableRoll = tablenest(figureTypeTableDef);

  var player: Soul = instantiateFromDef({
    def: soulDefs.player,
    id: 'player',
    //facing: [0, -1]
    facing: [1, 0]
  });
  var grail: Soul = instantiateFromDef({
    def: soulDefs.grail,
    id: 'grail'
  });

  var souls: Array<Soul> = [];

  // Add obstructions before guys.
  instantiateSouls({
    quantity: probable.rollDie(8) + probable.rollDie(8),
    getType: obstructionTypeTableRoll
  });
  instantiateSouls({
    quantity: probable.rollDie(16) + probable.roll(16),
    getType: figureTypeTableRoll
  });

  souls.push(player);
  souls.push(grail);

  var emptySpotsForGrids = initEmptySpotsForGrids(grids);
  souls.forEach(curry(setGridProps)(probable, grids, emptySpotsForGrids));

  return souls;

  function instantiateFromDef({
    def,
    id,
    facing
  }: {
    def: SoulDef;
    id?: string;
    facing?: Pt;
  }): Soul {
    var instance: Soul = cloneDeep(def);
    if (id) {
      instance.id = id;
    } else {
      instance.id = instance.type + '-' + randomId(4);
    }

    instance.facing =
      facing || probable.pickFromArray(def.facingsAllowed || facingDirections);

    if (def.startingItemIds) {
      instance.items = def.startingItemIds.map(instantiateFromDefId);
    } else {
      instance.items = [];
    }
    return instance;
  }

  function instantiateFromDefId(id: string) {
    return instantiateFromDef({ def: soulDefs[id] });
  }

  function instantiateSouls({
    quantity,
    getType
  }: {
    quantity: number;
    getType: () => string;
  }) {
    for (var i = 0; i < quantity; ++i) {
      let soul: Soul = instantiateFromDef({
        def: soulDefs[getType()]
      });
      souls.push(soul);
    }
  }
}

// Mutates emptySpotsForGrids.
function setGridProps(
  probable,
  grids,
  emptySpotsForGrids: Record<string, Array<ColRow>>,
  soul: Soul
) {
  var allowedGrids = grids.filter(gridIsAllowed);
  let grid = probable.pickFromArray(allowedGrids);
  var emptyGridSpots: Array<ColRow> = emptySpotsForGrids[grid.id];
  const spotIndex = probable.roll(emptyGridSpots.length);
  soul.gridContext = {
    id: grid.id,
    colRow: emptyGridSpots[spotIndex]
  };
  emptyGridSpots.splice(spotIndex, 1);

  function gridIsAllowed(grid) {
    return soul.allowedGrids.includes(grid.id);
  }
}

function initEmptySpotsForGrids(
  grids: Array<Grid>
): Record<string, Array<ColRow>> {
  var spotsForGrids = {};
  grids.forEach(addSpotsForGrid);
  return spotsForGrids;

  function addSpotsForGrid(grid: Grid) {
    if (grid.rows) {
      spotsForGrids[grid.id] = flatten(grid.rows.map(spotsForRow));
    }
  }

  function spotsForRow(row: Array<GridIntersection>): Array<ColRow> {
    return pluck(row, 'colRow');
  }
}

module.exports = generateSouls;
