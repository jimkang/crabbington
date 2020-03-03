var cloneDeep = require('lodash.clonedeep');
var RandomId = require('@jimkang/randomid');
var Probable = require('probable').createProbable;

import { Soul } from '../types';
import { soulDefs } from '../defs/soul-defs';

function generateSouls({ random, grids }) {
  var probable = Probable({ random });
  var randomId = RandomId({ random });
  var soulTypeTable = probable.createTableFromSizes([
    [3, 'doof'],
    [1, 'plantGuy'],
    [1, 'octo'],
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
  ]);

  var player: Soul = instantiateFromDef({ def: soulDefs.player, id: 'player' });
  var souls: Array<Soul> = [];

  var numberOfSouls = probable.rollDie(16) + probable.roll(16);

  for (var i = 0; i < numberOfSouls; ++i) {
    let soul: Soul = instantiateFromDef({
      def: soulDefs[soulTypeTable.roll()]
    });
    souls.push(soul);
  }

  souls.push(player);

  souls.forEach(setGridProps);
  return souls;

  function setGridProps(soul) {
    var allowedGrids = grids.filter(gridIsAllowed);
    let grid = probable.pickFromArray(allowedGrids);
    soul.grid = {
      id: grid.id,
      colOnGrid: probable.roll(grid.rows[0].length),
      rowOnGrid: probable.roll(grid.rows.length)
    };

    function gridIsAllowed(grid) {
      return soul.allowedGrids.includes(grid.id);
    }
  }

  function instantiateFromDef({ def, id }: { def: Soul; id?: string }) {
    var instance: Soul = cloneDeep(def);
    if (id) {
      instance.id = id;
    } else {
      instance.id = instance.type + '-' + randomId(4);
    }
    return instance;
  }
}

module.exports = generateSouls;
