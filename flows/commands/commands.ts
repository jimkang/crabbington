var cloneDeep = require('lodash.clonedeep');

import { CommandDef, Command, Soul } from '../../types';
// TODO: Rename to blastCmdFn, et al.
import { blastCmd } from './blast-command';
import { takeCmd } from './take-command';
import { bonkCmd } from './bonk-command';

export var cmdDefsById: Record<string, CommandDef> = {
  blast: { id: 'blast', name: 'Blast', cmdFn: blastCmd },
  take: { id: 'take', name: 'Take', cmdFn: takeCmd },
  bonk: { id: 'bonk', name: 'Bonk', cmdFn: bonkCmd }
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
  instance.params = params;
  return instance;
}
