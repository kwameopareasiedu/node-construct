import chalk from "chalk";
const consoleLog = console.log;

export const logInfo = (message: string): void => consoleLog(chalk.cyan(message));

export const logSuccess = (message: string): void => consoleLog(chalk.green(message));

export const logWarning = (message: string): void => consoleLog(chalk.yellow.underline(message));

export const logError = (message: string): void => consoleLog(chalk.red.bold(message));
