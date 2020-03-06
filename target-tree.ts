import { Box, TargetTree } from './types';
var RBush = require('rbush');

export function createTargetTree(): TargetTree {
  var targetTree = new RBush(9);
  // TODO: Remove when we feel comforable
  // that the targetTree is not bloating.
  var idsOfThingsInTree: Set<string> = new Set();

  return {
    insert,
    remove,
    updateItemBox,
    search,
    raw,
    getIdsOfThingsInTree
  };

  function insert(item: Box): void {
    if (idsOfThingsInTree.has(item.id)) {
      throw new Error('Already added: ' + item.id);
    } else if (!item.id) {
      throw new Error('No id!');
    } else {
      targetTree.insert(item);
      idsOfThingsInTree.add(item.id);
      //console.log(
      //'insert: idsOfThingsInTree',
      //Array.from(idsOfThingsInTree).length
      //);
      //console.log('targetTree.length', targetTree.all().length);
    }
  }

  function remove(item: Box): void {
    targetTree.remove(item);
    idsOfThingsInTree.delete(item.id);
    //console.log(
    //'remove: idsOfThingsInTree',
    //Array.from(idsOfThingsInTree).length
    //);
    //console.log('targetTree.length', targetTree.all().length);
  }

  // updateItemBox sets the Box dimension in item to the
  // ones in newBox.
  // Removing and inserting is just how you update positions
  // in rbush: https://github.com/mourner/rbush/issues/82
  // However, when removing an item, it's important to note that the
  // Box dimensions must be the same as they were when they
  // were first inserted into the tree. So, when updating an
  // item, first remove it without changing it. If you don't,
  // rbush won't be able to find it!
  // Only after it is removed should you update the dimensions
  // and reinsert it.
  function updateItemBox(item: Box, newBox: Box): void {
    remove(item);
    Object.assign(item, newBox);
    insert(item);
    if (Array.from(idsOfThingsInTree).length !== targetTree.all().length) {
      debugger;
    }
  }

  function search(bounds: Box): Array<Box> {
    return targetTree.search(bounds);
  }

  function raw() {
    return targetTree;
  }

  function getIdsOfThingsInTree() {
    return idsOfThingsInTree;
  }
}
