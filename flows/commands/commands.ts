var cloneDeep = require('lodash.clonedeep');

import { CommandDef, Command, Soul } from '../../types';
// TODO: Rename to blastCmdFn, et al.
import { blastCmd } from './blast-command';
import { takeCmd } from './take-command';
import { bonkCmd } from './bonk-command';
import { moveCmd } from './move-command';

export var cmdDefsById: Record<string, CommandDef> = {
  blast: {
    id: 'blast',
    name: 'Blast',
    cmdFn: blastCmd,
    params: { blastSize: 3, color: 'yellow' }
  },
  smallBlast: {
    id: 'smallBlast',
    name: 'Blast',
    cmdFn: blastCmd,
    params: { blastSize: 1.5, color: 'red' }
  },
  take: { id: 'take', name: 'Take', cmdFn: takeCmd },
  bonk: { id: 'bonk', name: 'Bonk', cmdFn: bonkCmd },
  move: { id: 'move', name: 'Move', cmdFn: moveCmd }
};

export function instantiateCmdFromDef(
  actor: Soul,
  targets: Array<Soul>,
  params,
  def: CommandDef
) {
  var instance: Command = cloneDeep(def);
  instance.actor = actor;
  instance.targets = targets;
  if (params) {
    if (!instance.params) {
      instance.params = {};
    }
    Object.assign(instance.params, params);
  }
  return instance;
}
