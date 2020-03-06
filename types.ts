export type Pt = [number, number];
export type ColRow = [number, number]; // Wish I could specific integers here.

export interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type Filter = (any) => boolean;

export type ColRowFindFn = ({ colRow }: { colRow: ColRow }) => Array<any>;

export interface MoveParams {
  soul: Soul;
  neighbors: Array<Pt>;
  probable;
  getTargetsAtColRow: ColRowFindFn;
  canMoveHereFn?: CanMoveHereFn;
}

export interface CanMoveHereParams {
  getTargetsAtColRow: ColRowFindFn;
  colRow: ColRow;
}

export type MoveFn = (MoveParams) => Pt;
export type CanMoveHereFn = (CanMoveHereParams) => boolean;

export interface CanMoveHereDef {
  avoid: Array<string>;
}

export interface Command {
  cmdType: string;
}

// Done should be called when the command is completely
// done updating state. If it has animations, it should
// usually wait until those are done before calling done().
export interface CmdFn {
  (CmdParams, done: Done): void;
}

export interface CmdParams {
  gameState: GameState;
  targetTree;
  // TODO: Define type that encompassing all the
  // things that can come from the targetTree.
  doSoulRemoval: (Array) => void;
}

export interface SoulDef {
  type: string;
  categories: Array<string>;
  move?: MoveFn;
  canMoveHereFn?: CanMoveHereFn;
  getInteractionsWithThing?: (any) => Array<string>;
  sprite: Sprite;
  allowedGrids: Array<string>;
  startingItemIds?: Array<string>;
  itemRole?: ItemRole;
  facingsAllowed?: Array<Pt>;
}

export interface Soul extends SoulDef {
  id: string;
  facing: Pt;
  // TODO: Replace x and y with Pt.
  x?: number;
  y?: number;
  gridContext?: GridContext;
  items?: Array<Soul>;
}

export interface ItemRole {
  itemPositioningStyle: string;
  offset?: Pt;
}

export interface GridContext {
  id: string;
  colRow: ColRow;
}

export interface Sprite {
  col: number;
  row: number;
  width: number;
  height: number;
  hitRadius: number;
}

export type Done = (Error, any?) => void;

export interface AnimationDef extends CircleDef {
  type: string;
  duration: number;
  postAnimationGameStateUpdater: Done;
}

export interface GameState {
  allowAdvance: boolean;
  uiOn: boolean;
  actionChoices: Array<string>;
  animations: Array<AnimationDef>;
  ephemerals: {
    blasts: Array<BlastDef>;
  };
  gridsInit: boolean;
  grids?: Array<Grid>;
  souls?: Array<Soul>;
  player?: Soul;
  lastClickedThingIds: Array<string>;
  displayMessage?: string;
  gameWon: boolean;
}

export interface Grid {
  id: string;
  unitWidth: number;
  unitHeight: number;
  xOffset: number;
  yOffset: number;
  numberOfCols: number;
  numberOfRows: number;
  width: number;
  height: number;
  color: string;
  rows?: Array<Array<GridIntersection>>;
  effects?: Array<EffectDef>;
}

export interface GridIntersection extends Partial<Box> {
  pt: Pt;
  colRow: ColRow;
  gridId: string;
}

export interface BlastDef extends CircleDef {
  color: string;
}

export interface CircleDef {
  cx: number;
  cy: number;
  r: number;
}

export interface CurvesKit {
  start: Pt;
  curves: Array<BezierStep>;
}

export interface BezierStep {
  srcCtrl: Pt;
  destCtrl: Pt;
  dest: Pt;
}

export interface EffectDef {
  name: string;
  centers?: Array<[number, number]>;
  strength?: number;
  decayDist?: number;
}
