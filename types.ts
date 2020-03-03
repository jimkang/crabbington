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
}) => Array<any>; // Actually, Array<Soul>

export interface MoveParams {
  soul: any;
  neighbors: Array<Pt>;
  probable: any;
  getTargetsInBox: BoxFindFn;
}

export type MoveFn = (MoveParams) => Pt;
