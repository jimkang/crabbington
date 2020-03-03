import { RandomMove } from './moves';
import { spriteSize } from '../sizes';
import { SoulDef } from '../types';

var randomMoveAvoidAll = RandomMove({ avoidAll: true });
var randomMoveAvoidGuys = RandomMove({ avoid: ['guy'] });

var defList: Array<SoulDef> = [
  {
    type: 'plantGuy',
    categories: ['guy'],
    move: randomMoveAvoidAll,
    sprite: {
      col: 2,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-air']
  },
  {
    type: 'doof',
    categories: ['guy'],
    move: randomMoveAvoidAll,
    sprite: {
      col: 1,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'octo',
    categories: ['guy'],
    move: randomMoveAvoidGuys,
    sprite: {
      col: 0,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures'],
    startingItemIds: ['beanie']
  },
  {
    type: 'player',
    categories: ['guy'],
    sprite: {
      col: 7,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 48
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'snailShell',
    categories: ['item'],
    sprite: {
      col: 3,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'beanie',
    categories: ['item'],
    sprite: {
      col: 4,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures'],
    offsetAsItem: [0, -64]
  },
  {
    type: 'box',
    categories: ['item'],
    sprite: {
      col: 5,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'bucket',
    categories: ['item'],
    sprite: {
      col: 6,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'cup',
    categories: ['item'],
    sprite: {
      col: 9,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'fancyShell',
    categories: ['item'],
    sprite: {
      col: 10,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'spaceHelmet',
    categories: ['item'],
    sprite: {
      col: 11,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'horn',
    categories: ['item'],
    sprite: {
      col: 12,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'lagavulin',
    categories: ['item'],
    sprite: {
      col: 13,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'blueSnailShell',
    categories: ['item'],
    sprite: {
      col: 14,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'longShell',
    categories: ['item'],
    sprite: {
      col: 15,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'pot',
    categories: ['item'],
    sprite: {
      col: 16,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'shoe',
    categories: ['item'],
    sprite: {
      col: 17,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'skull',
    categories: ['item'],
    sprite: {
      col: 18,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'soupCan',
    categories: ['item'],
    sprite: {
      col: 19,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'simpleShell',
    categories: ['item'],
    sprite: {
      col: 20,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'trilby',
    categories: ['item'],
    sprite: {
      col: 21,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'purpleShell',
    categories: ['item'],
    sprite: {
      col: 22,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  }
];

export var soulDefs: Record<string, SoulDef> = {};

defList.forEach(addToDict);

function addToDict(def: SoulDef) {
  soulDefs[def.type] = def;
}
