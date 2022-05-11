import log from 'loglevel';
import chalk from 'chalk';
import type { CommandInteraction } from 'discord.js';

type ColorFunction = (msg: string) => string;

const prefixes = new Map<string, string>([
  ['trace', 'TRACE'],
  ['debug', 'DEBUG'],
  ['info', 'INFO'],
  ['warn', 'WARN'],
  ['error', 'ERROR'],
]);

const noColor: (str: string) => string = (msg) => msg;
const colorFunctions = new Map<string, ColorFunction>([
  ['debug', chalk.gray],
  ['info', chalk.cyan],
  ['warn', chalk.yellow],
  ['error', chalk.red.bold.italic],
]);

export default class Logger {
  public static writeLog(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', ...args: string[]) {
    const prefix = prefixes.get(level);
    let color = colorFunctions.get(level);
    if (!color) color = noColor;

    const date = new Date();
    const statement = [
      `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`,
      color(prefix || 'DEBUG'),
      '>',
      ...args,
    ];

    switch (level) {
      case 'trace':
        log.trace(...statement);
        break;
      case 'debug':
        log.debug(...statement);
        break;
      case 'info':
        log.info(...statement);
        break;
      case 'warn':
        log.warn(...statement);
        break;
      case 'error':
        log.error(...statement);
        break;
      default:
        log.debug(...statement);
    }
  }

  public static setDevMode() {
    log.setLevel('info');
    log.info(chalk.bgGreen.black.italic.bold(' [DEVELOPMENT MODE] set to TRUE, info level logging will be enabled. '));
  }

  public static trace(...args: string[]) {
    Logger.writeLog('trace', ...args);
  }

  public static debug(...args: string[]) {
    Logger.writeLog('debug', ...args);
  }

  public static info(...args: string[]) {
    Logger.writeLog('info', ...args);
  }

  public static warn(...args: string[]) {
    Logger.writeLog('warn', ...args);
  }

  public static error(...args: string[]) {
    Logger.writeLog('error', ...args);
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
