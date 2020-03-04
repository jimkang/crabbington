export type Pt = [number, number];
export type ColRow = [number, number]; // Wish I could specific integers here.

export interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type Filter = (any) => boolean;

export type BoxFindFn = ({
  box,
  filter
}: {
  box: Box;
  filter?: Filter;
}) => Array<any>;

export type ColRowFindFn = ({ colRow }: { colRow: ColRow }) => Array<any>;

export interface MoveParams {
  soul: Soul;
  neighbors: Array<Pt>;
  probable;
  getTargetsAtColRow: ColRowFindFn;
}

export type MoveFn = (MoveParams) => Pt;

export interface SoulDef {
  type: string;
  categories: Array<string>;
  move?: MoveFn;
  getInteractionsWithThing?: (any) => Array<string>;
  sprite: Sprite;
  allowedGrids: Array<string>;
  startingItemIds?: Array<string>;
  offsetAsItem?: Pt;
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

export interface Command {
  cmdType: string;
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
