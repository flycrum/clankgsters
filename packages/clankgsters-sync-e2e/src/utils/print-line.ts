import chalk from 'chalk';

/** Prefixes e2e log lines with a colored bullet so failures, info, and success scan quickly in the terminal. */
export const printLine = {
  /** Formats a failure line (red ✖). */
  error(message: string): string {
    return `${chalk.red(' ✖')} ${message}`;
  },
  /** Formats a neutral info line (cyan •). */
  info(message: string): string {
    return `${chalk.cyan(' •')} ${message}`;
  },
  /** Formats a success line (green ✓). */
  success(message: string): string {
    return `${chalk.green(' ✓')} ${message}`;
  },
};
