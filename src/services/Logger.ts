import chalk from 'chalk';
import type { CommandInteraction } from 'discord.js';
import pino from 'pino';

export default class Logger {
  private static Pino = pino(pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    },
  }));

  public static setDevMode() {
    Logger.Pino.level = 'info';
    Logger.info(chalk.bgGreen.black.italic.bold(' [DEVELOPMENT MODE] set to TRUE, info level logging will be enabled. '));
  }

  public static setProdMode() {
    Logger.Pino.level = 'warn';
  }

  public static trace(message: string) {
    Logger.Pino.trace(message);
  }

  public static debug(message: string) {
    Logger.Pino.debug(message);
  }

  public static info(message: string) {
    Logger.Pino.info(message);
  }

  public static warn(message: string) {
    Logger.Pino.warn(message);
  }

  public static error(message: string) {
    Logger.Pino.error(message);
  }

  public static logCommand(
    info: CommandInteraction,
    type: 'Failure' | 'Success' | 'Trigger' | 'Slowmode' | 'Missing' | 'Inhibit',
    commandName: string,
  ) {
    let command: string;
    if (['Failure', 'Slowmode', 'Missing'].includes(type)) {
      command = `[COMMAND: ${chalk.bgYellow.black(commandName || 'Unknown')} - ${chalk.bgBlack.red(type)}]`;
    } else {
      command = `[COMMAND: ${chalk.bgYellow.black(commandName || 'Unknown')} - ${chalk.bgBlack(type === 'Success' ? chalk.green(type) : chalk.white(type))}]`;
    }

    const user = chalk.bgGreen.black(
      `${info.user.username}#${info.user.discriminator.toString().padStart(4, '0')}(${info.id})`,
    );
    const guild = chalk.bgMagenta.black(`${info.guildId ? `Guild ID: (${info.guildId})` : 'DM'}`);

    Logger.info(`${command} by ${user} in ${guild} with MessageID: ${info.id}`);
  }
}
