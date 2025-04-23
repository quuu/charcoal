import yargs from 'yargs';
import { move, TMoveArgs } from '../actions/move';
import { graphite } from '../lib/runner';

export const command = 'move';
export const description = 'Move a branch to have a different parent';
export const aliases = ['mv'];

export const builder = {
  onto: {
    alias: 'o',
    describe: 'Branch to move the current branch onto',
    type: 'string' as const,
    demandOption: true,
  },
  source: {
    describe: 'Branch to move (defaults to current branch)',
    type: 'string' as const,
  },
};

type ArgsT = yargs.Arguments<yargs.InferredOptionTypes<typeof builder>>;

export const handler = (argv: ArgsT): Promise<void> =>
  graphite(argv, command, async (context) =>
    move(
      {
        onto: argv.onto,
        source: argv.source,
      } as TMoveArgs,
      context
    )
  );
