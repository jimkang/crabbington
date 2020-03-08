var math = require('basic-2d-math');
import { sortVectorsByCloseness } from '../../ops/dist-ops';
import { CmdParams, ColRow, GridContext } from '../../types';
import { updateSoul } from '../update-soul';

export function moveCmd({ gameState, targetTree, cmd }: CmdParams) {
  cmd.actor.facing = getFacingDir(
    cmd.actor.facingsAllowed,
    cmd.actor.gridContext,
    cmd.params.destColRow
  );
  cmd.actor.gridContext.colRow = cmd.params.destColRow;
  updateSoul(gameState.grids, targetTree, cmd.actor);
}

function getFacingDir(
  facingsAllowed: Array<ColRow>,
  srcGridContext: GridContext,
  dest: ColRow
): [number, number] {
  var dir: [number, number] = math.subtractPairs(dest, srcGridContext.colRow);
  if (facingsAllowed) {
    // Is it really worth doing this much work to make
    // the guy face the right way?
    dir = sortVectorsByCloseness(dir, facingsAllowed)[0];
  }
  return dir;
}
