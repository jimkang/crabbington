import { Box, ColRow, Pt } from '../types';
import { spriteSize } from '../sizes';

// If corner is provided, it is assumed that the box
// corner aligns with that corner.
// If center is provided, it is assumed that the box
// center aligns with that center.
export function getBoxAroundPosition({
  corner,
  center,
  boxWidth,
  boxHeight,
  inset = 1
}: {
  corner?: ColRow;
  center?: ColRow;
  boxWidth: number;
  boxHeight: number;
  inset?: number;
}): Box {
  var centerX;
  var centerY;
  if (center) {
    centerX = center[0] * spriteSize;
    centerY = center[1] * spriteSize;
  } else {
    centerX = (corner[0] + 0.5) * spriteSize;
    centerY = (corner[1] + 0.5) * spriteSize;
  }
  return {
    minX: centerX - boxWidth / 2 + inset,
    maxX: centerX + boxWidth / 2 - inset,
    minY: centerY - boxHeight / 2 + inset,
    maxY: centerY + boxHeight / 2 - inset
  };
}

export function getBoxAroundCenter({
  center,
  boxWidth,
  boxHeight
}: {
  center: Pt;
  boxWidth: number;
  boxHeight: number;
}): Box {
  return {
    minX: center[0] - boxWidth / 2,
    maxX: center[0] + boxWidth / 2,
    minY: center[1] - boxHeight / 2,
    maxY: center[1] + boxHeight / 2
  };
}

/*
export function getSpriteBoxContainingPoint({
  pt,
  inset = 0
}: {
  pt: Pt;
  inset?: number;
}): Box {
  const minX: number = ~~(pt[0] / spriteSize) * spriteSize;
  const maxX: number = minX + spriteSize;
  const minY: number = ~~(pt[1] / spriteSize) * spriteSize;
  const maxY: number = minY + spriteSize;
  return {
    minX: minX + inset,
    maxX: maxX - inset,
    minY: minY + inset,
    maxY: maxY - inset
  };
}
*/
