import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import Config from './Config';
import type BotEventHandler from './types/BotEventHandler';
import CommandHandler from './commands/CommandHandler';
import Logger from './services/Logger';

export default class ExtendedClient extends Client {
  private readonly events: BotEventHandler[];

  readonly commands: CommandHandler;

  public constructor() {
    super({ intents: Config.GATEWAY_INTENTS });
    this.events = [];
    this.commands = new CommandHandler();
  }

  private async loadEvents() {
    const eventPaths = fs.readdirSync(path.resolve(__dirname, 'events')).filter((filename) => filename.match(/\.([tj])s$/));
    await Promise.all(eventPaths.map(async (filename) => {
      const event = await import(`./events/${filename}`);
      this.events.push(event.default);
    }));

    if (!this.events) return Logger.warn('No events were found!');

    this.events.forEach((event) => {
      if (event.once) {
        this.once(event.name, (...args) => event.execute(this, ...args));
      } else {
        this.on(event.name, (...args) => event.execute(this, ...args));
      }
    });

    return Logger.info(`${this.events.length} events loaded!`);
  }

  public async initialise() {
    if (Config.DEVELOPMENT_MODE) Logger.setDevMode();
    else Logger.setProdMode();
    Logger.info(chalk.yellow('INITIALIZING...'));
    await this.loadEvents();

    await this.commands.load();
    await this.commands.update();

    await this.login(Config.DISCORD_TOKEN);
  }
}

new ExtendedClient().initialise();
