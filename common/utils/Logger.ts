import chalk from 'chalk';

export class Logger {

  static info(message: string, ...optionalParams: any[]): void {
    console.info(chalk.green(`[INFO] ${new Date().toISOString()} -`), message, ...optionalParams);
  }

  static warn(message: string, ...optionalParams: any[]): void {
    console.warn(chalk.yellow(`[WARN] ${new Date().toISOString()} -`), message, ...optionalParams);
  }

  static error(message: string, ...optionalParams: any[]): void {
    console.error(chalk.red(`[ERROR] ${new Date().toISOString()} -`), message, ...optionalParams);
  }

  static debug(message: string, ...optionalParams: any[]): void {
    console.debug(chalk.cyan(`[DEBUG] ${new Date().toISOString()} -`), message, ...optionalParams);
  }

}