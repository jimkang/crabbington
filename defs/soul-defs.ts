import { RandomMove } from './moves';
import { spriteSize } from '../sizes';
import { Soul } from '../types';

var randomMoveAvoidAll = RandomMove({ avoid: ['all'] });

var defList: Array<Soul> = [
  {
    type: 'plantGuy',
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
    move: randomMoveAvoidAll,
    sprite: {
      col: 0,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'player',
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
    sprite: {
      col: 4,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: 100
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'box',
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

export var soulDefs: Record<string, Soul> = {};

defList.forEach(addToDict);

function addToDict(def: Soul) {
  soulDefs[def.type] = def;
}
