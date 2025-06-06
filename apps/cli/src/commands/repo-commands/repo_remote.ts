import yargs from 'yargs';
import { graphite } from '../../lib/runner';

const args = {
  set: {
    optional: false,
    type: 'string',
    alias: 's',
    describe:
      "Override the name of the remote repository. Only set this if you are using a remote other than 'origin'.",
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'remote';
export const canonical = 'repo remote';
export const description =
  "Specifies the remote that Charcoal pushes to/pulls from (defaults to 'origin')";
export const builder = args;
export const handler = async (argv: argsT): Promise<void> => {
  return graphite(argv, canonical, async (context) => {
    if (argv.set) {
      context.repoConfig.setRemote(argv.set);
    } else {
      context.splog.info(context.repoConfig.getRemote());
    }
  });
};
