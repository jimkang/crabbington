var cloneDeep = require('lodash.clonedeep');
var RandomId = require('@jimkang/randomid');
var Probable = require('probable').createProbable;
var { Tablenest, r } = require('tablenest');

import { SoulDef, Soul, Pt } from '../types';
import { soulDefs } from '../defs/soul-defs';

// Sprites are assumed to face the right by default.
var facingDirections: Array<Pt> = [[1, 0], [0, -1], [-1, 0], [0, 1]];

var soulTypeTableDef = {
  root: [[3, r`guy`], [2, r`item`]],
  guy: [[3, 'doof'], [1, 'plantGuy'], [1, 'octo']],
  item: [
    [1, 'snailShell'],
    [1, 'beanie'],
    [1, 'box'],
    [1, 'bucket'],
    [1, 'cup'],
    [1, 'fancyShell'],
    [1, 'spaceHelmet'],
    [1, 'horn'],
    [1, 'lagavulin'],
    [1, 'blueSnailShell'],
    [1, 'longShell'],
    [1, 'pot'],
    [1, 'shoe'],
    [1, 'skull'],
    [1, 'soupCan'],
    [1, 'simpleShell'],
    [1, 'trilby'],
    [1, 'purpleShell']
  ]
};

function generateSouls({ random, grids }) {
  var probable = Probable({ random });
  var randomId = RandomId({ random });
  var tablenest = Tablenest({ random });

  var soulTypeTableRoll = tablenest(soulTypeTableDef);

  var player: Soul = instantiateFromDef({
    def: soulDefs.player,
    id: 'player',
    //facing: [0, -1]
    facing: [1, 0]
  });
  var souls: Array<Soul> = [];

  var numberOfSouls = probable.rollDie(16) + probable.roll(16);

  for (var i = 0; i < numberOfSouls; ++i) {
    let soul: Soul = instantiateFromDef({
      def: soulDefs[soulTypeTableRoll()]
    });
    souls.push(soul);
  }

  souls.push(player);

  souls.forEach(setGridProps);
  return souls;

  function setGridProps(soul: Soul) {
    var allowedGrids = grids.filter(gridIsAllowed);
    let grid = probable.pickFromArray(allowedGrids);
    soul.gridContext = {
      id: grid.id,
      colOnGrid: probable.roll(grid.rows[0].length),
      rowOnGrid: probable.roll(grid.rows.length)
    };

    function gridIsAllowed(grid) {
      return soul.allowedGrids.includes(grid.id);
    }
  }

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

    instance.facing = facing || probable.pickFromArray(facingDirections);

    if (def.startingItemIds) {
      instance.items = def.startingItemIds.map(instantiateFromDefId);
    }
    return instance;
  }

  function instantiateFromDefId(id: string) {
    return instantiateFromDef({ def: soulDefs[id] });
  }
}

module.exports = generateSouls;
