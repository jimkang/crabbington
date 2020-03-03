import { Box, ColRow } from '../types';
import { spriteSize } from '../sizes';

export function getBoxAroundPosition({
  position,
  boxWidth,
  boxHeight,
  inset = 1
}: {
  position: ColRow;
  boxWidth: number;
  boxHeight: number;
  inset?: number;
}): Box {
  // position is the top left corner of the sprite.
  const centerX = (position[0] + 0.5) * spriteSize;
  const centerY = (position[1] + 0.5) * spriteSize;
  return {
    minX: centerX - boxWidth / 2 + inset,
    maxX: centerX + boxWidth / 2 - inset,
    minY: centerY - boxHeight / 2 + inset,
    maxY: centerY + boxHeight / 2 - inset
  };
}
