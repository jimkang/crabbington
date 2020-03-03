var soulDefs = require('../defs/soul-defs');
var cloneDeep = require('lodash.clonedeep');
var RandomId = require('@jimkang/randomid');
var Probable = require('probable').createProbable;

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

  var player = instantiateFromDef({ def: soulDefs.player, id: 'player' });
  var souls = [];

  var numberOfSouls = probable.rollDie(16) + probable.roll(16);

  for (var i = 0; i < numberOfSouls; ++i) {
    let soul = instantiateFromDef({ def: soulDefs[soulTypeTable.roll()] });
    souls.push(soul);
  }

  souls.push(player);

  souls.forEach(setGridProps);
  return souls;

  function setGridProps(soul) {
    let grid = probable.pickFromArray(grids);
    soul.grid = {
      id: grid.id,
      colOnGrid: probable.roll(grid.rows[0].length),
      rowOnGrid: probable.roll(grid.rows.length)
    };
  }

  function instantiateFromDef({ def, id }) {
    var instance = cloneDeep(def);
    if (id) {
      instance.id = id;
    } else {
      instance.id = instance.type + '-' + randomId(4);
    }
    return instance;
  }
}

module.exports = generateSouls;
