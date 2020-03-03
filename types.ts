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
  probable: any;
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
  x?: number;
  y?: number;
  gridContext?: GridContext;
  items?: Array<Soul>;
}

export interface GridContext {
  id: string;
  colOnGrid: number;
  rowOnGrid: number;
}

export interface Sprite {
  col: number;
  row: number;
  width: number;
  height: number;
  hitRadius: number;
}
