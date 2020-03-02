var soulDefs = require('../defs/soul-defs');
var randomId = require('idmaker').randomId;
var cloneDeep = require('lodash.clonedeep');

function generateSouls({ probable, grids }) {
  var soulTypeTable = probable.createTableFromSizes([
    [3, 'doof'],
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

  var player = cloneDeep(soulDefs.player);
  player.id = 'player';
  var souls = [];

  var numberOfSouls = probable.rollDie(16) + probable.roll(16);

  for (var i = 0; i < numberOfSouls; ++i) {
    let soul = cloneDeep(soulDefs[soulTypeTable.roll()]);
    soul.id = soul.type + '-' + randomId(4);
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
}

module.exports = generateSouls;
