import chalk from 'chalk';
import { TContext } from '../lib/context';
import { DetachedError, NoBranchError } from '../lib/errors';

export type TMoveArgs = {
  onto: string;
  source?: string;
};

export async function move(args: TMoveArgs, context: TContext): Promise<void> {
  const { onto, source } = args;

  try {
    // Default to current branch if source is not specified
    const sourceBranch = source || context.engine.currentBranchPrecondition;
    const targetBranch = onto;

    // Make sure target branch exists
    if (!context.engine.branchExists(targetBranch)) {
      throw new NoBranchError(targetBranch);
    }

    // Execute the move operation
    const result = context.engine.move({
      sourceBranch,
      targetBranch,
    });

    if (result.result === 'MOVE_DONE') {
      context.splog.info(
        `Successfully moved ${chalk.yellow(sourceBranch)} onto ${chalk.yellow(
          targetBranch
        )}`
      );
    } else {
      context.splog.error(
        chalk.red(
          `Rebase conflict while moving ${chalk.yellow(
            sourceBranch
          )} onto ${chalk.yellow(targetBranch)}.`
        )
      );
      context.splog.error(
        `Resolve conflicts and run ${chalk.cyan('gt continue')}.`
      );
      throw new Error('Rebase conflict during move operation');
    }
  } catch (e) {
    if (e instanceof DetachedError) {
      context.splog.error(
        chalk.red(
          `You are in a detached HEAD state. Please checkout a branch first.`
        )
      );
    } else if (e instanceof NoBranchError) {
      context.splog.error(
        chalk.red(
          `Could not find branch ${chalk.yellow((e as NoBranchError).message)}.`
        )
      );
    } else {
      context.splog.error(chalk.red((e as Error).message));
    }
    throw e;
  }
}
