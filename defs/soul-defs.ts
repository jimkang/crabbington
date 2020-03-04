import { getMoveFn } from './moves';
import { spriteSize } from '../sizes';
import { SoulDef } from '../types';

// New entry macro: @e
var defList: Array<SoulDef> = [
  {
    type: 'avocado',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 0,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'basicShell',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 1,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'beanie',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 2,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell', offset: [0, -64] }
  },
  {
    type: 'box',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 3,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'bucket',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 4,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'bug',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy'] }),
    facingsAllowed: [[1, 0], [-1, 0]],
    sprite: {
      col: 0,
      row: 5,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'cat',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy'] }),
    sprite: {
      col: 0,
      row: 6,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'cloud',
    categories: ['guy'],
    move: getMoveFn({ avoid: [] }),
    facingsAllowed: [[1, 0], [-1, 0]],
    sprite: {
      col: 0,
      row: 7,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-air']
  },
  {
    type: 'corn',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 8,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  // TODO: Get sleep, other animation in.
  {
    type: 'player',
    categories: ['guy'],
    getInteractionsWithThing: getPlayerInteractionsWithThing,
    sprite: {
      col: 0,
      row: 10,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'cup',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 12,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'devil',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 13,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'fancyShell',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 14,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'helmet',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 15,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'horn',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 16,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'lagavulinShell',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 17,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'largeShell',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 18,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'longShell',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 19,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'pan',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 20,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'pointyRock',
    categories: ['obstruction'],
    sprite: {
      col: 0,
      row: 21,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    facingsAllowed: [[1, 0]],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'roundRock',
    categories: ['obstruction'],
    sprite: {
      col: 0,
      row: 22,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    facingsAllowed: [[1, 0]],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'shoe',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 23,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'skull',
    categories: ['item', 'guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 24,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'soupCan',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 25,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'SUV',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 26,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'tearDrop',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 27,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    facingsAllowed: [[1, 0], [-1, 0]],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'tinyShell',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 28,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'trike',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 29,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures']
  },
  {
    type: 'trilby',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 30,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'twistyShell',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 31,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'twoPointRock',
    categories: ['obstruction'],
    sprite: {
      col: 0,
      row: 32,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    facingsAllowed: [[1, 0]],
    allowedGrids: ['grid-figures']
  },
  {
    type: 'worm',
    categories: ['guy'],
    move: getMoveFn({ avoid: ['guy', 'obstruction'] }),
    sprite: {
      col: 0,
      row: 33,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-air'],
    itemRole: { itemPositioningStyle: 'shell' }
  },
  {
    type: 'grail',
    categories: ['item'],
    sprite: {
      col: 0,
      row: 34,
      width: spriteSize,
      height: spriteSize,
      hitRadius: spriteSize * 0.75
    },
    allowedGrids: ['grid-figures'],
    itemRole: { itemPositioningStyle: 'shell' }
  }
];

export var soulDefs: Record<string, SoulDef> = {};

defList.forEach(addToDict);

function addToDict(def: SoulDef) {
  soulDefs[def.type] = def;
}

function getPlayerInteractionsWithThing(thing): Array<string> {
  if (thing.type && thing.type === 'player') {
    return ['blast'];
  }
  if (thing.categories && thing.categories.includes('item')) {
    return ['take'];
  }
  return [];
}
