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
}) => Array<Soul>;

export interface MoveParams {
  soul: Soul;
  neighbors: Array<Pt>;
  probable: any;
  getTargetsInBox: BoxFindFn;
}

export type MoveFn = (MoveParams) => Pt;

export interface SoulDef {
  type: string;
  move?: MoveFn;
  sprite: Sprite;
  allowedGrids: Array<string>;
}

export interface Soul extends SoulDef {
  id: string;
  facing: Pt;
  x?: number;
  y?: number;
}

export interface Sprite {
  col: number;
  row: number;
  width: number;
  height: number;
  hitRadius: number;
}
