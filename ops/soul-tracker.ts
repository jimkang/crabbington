var curry = require('lodash.curry');
var pluck = require('lodash.pluck');

import { Soul, Grid, TargetTree, SoulTracker, Box } from '../types';
import { updateSoul } from '../flows/update-soul';

export function createSoulTracker(): SoulTracker {
  var souls: Array<Soul> = [];
  var currentActingSoulIndex: number;

  return {
    getSouls,
    getActingSoul,
    addSouls,
    removeSouls,
    incrementActorIndex
  };

  // It's important to call updateSoul
  // because it gets the souls into the targetTree.
  function addSouls(
    grids: Array<Grid>,
    targetTree: TargetTree,
    soulsToAdd: Array<Soul>
  ): void {
    souls = souls.concat(soulsToAdd);
    soulsToAdd.map(curry(updateSoul)(grids, targetTree));
  }

  function removeSouls(
    targetTree: TargetTree,
    soulsToRemove: Array<Soul>
  ): void {
    var idsToRemove = pluck(soulsToRemove, 'id');
    soulsToRemove.forEach(curry(removeFromTargetTree)(targetTree));

    var actingSoulId: string = getActingSoul().id;
    // If the acting soul is getting removed, find a
    // replacement.
    var indexNeedsReplacement = false;

    // Find souls that match these idsToRemove, then splice them out of the array.
    var indexesToDelete = [];
    for (let i = 0; i < souls.length; ++i) {
      if (idsToRemove.includes(souls[i].id)) {
        indexesToDelete.push(i);
        if (i === currentActingSoulIndex) {
          indexNeedsReplacement = true;
        }
      }
    }

    if (indexNeedsReplacement) {
      for (let j = 1; j < souls.length; ++j) {
        let wrapAroundIndex = (currentActingSoulIndex + j) % souls.length;
        if (!indexesToDelete.includes(wrapAroundIndex)) {
          currentActingSoulIndex = wrapAroundIndex;
          break;
        }
      }
    }

    for (let k = indexesToDelete.length - 1; k >= 0; --k) {
      souls.splice(indexesToDelete[k], 1);
    }

    if (!indexNeedsReplacement) {
      currentActingSoulIndex = souls.findIndex(
        soul => soul.id === actingSoulId
      );
    }
  }

  function getSouls(): Array<Soul> {
    return souls;
  }

  function getActingSoul(): Soul {
    return souls[currentActingSoulIndex];
  }

  function incrementActorIndex() {
    if (currentActingSoulIndex === undefined) {
      currentActingSoulIndex = souls.findIndex(soul => soul.id === 'player');
    } else {
      currentActingSoulIndex += 1;
    }
    if (currentActingSoulIndex >= souls.length) {
      currentActingSoulIndex = 0;
    }
  }
}

function removeFromTargetTree(targetTree: TargetTree, soul: Soul) {
  targetTree.remove(soul as Box);
}
