import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import Config from '../Config';
import Logger from '../services/Logger';
import SlashCommand from '../types/SlashCommand';

export default class CommandHandler {
  private readonly devCommands: Map<string, SlashCommand>;

  private readonly publicCommands: Map<string, SlashCommand>;

  public constructor() {
    this.devCommands = new Map<string, SlashCommand>();
    this.publicCommands = new Map<string, SlashCommand>();
  }

  private async loadCommands(type: 'dev' | 'public') {
    let commandFiles: string[] = [];
    fs.readdirSync(path.resolve(__dirname, type), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .forEach((dirent) => {
        const commandsInDir = fs.readdirSync(path.resolve(__dirname, `${type}/${dirent.name}`))
          .filter((filename) => filename.match(/\.([tj])s$/))
          .map((filename) => `./${type}/${dirent.name}/${filename}`);
        commandFiles = [...commandFiles, ...commandsInDir];
      });

    await Promise.all(commandFiles.map(async (filepath) => {
      const command = await import(filepath);

      if (command.default && command.default instanceof SlashCommand) {
        if (type === 'dev') this.devCommands.set(command.default.name, command.default);
        else this.publicCommands.set(command.default.name, command.default);
      } else throw new Error(`Command file ${filepath} does not export a valid slash command as default.`);
    })).then(() => Logger.info(`${type === 'dev' ? `${this.devCommands.size} developer` : `${this.publicCommands.size} public`} commands loaded.`));
  }

  public async load() {
    if (!Config.DEVELOPMENT_MODE) await this.loadCommands('public');
    await this.loadCommands('dev');
  }

  public async update() {
    const rest = new REST({ version: '10' }).setToken(Config.DISCORD_TOKEN);

    try {
      if (this.publicCommands.size) {
        const body = Array.from(this.publicCommands.values())
          .map((cmd) => ({ name: cmd.name, description: cmd.description, options: cmd.options }));
        await rest.put(Routes.applicationCommands(Config.BOT_CLIENT_ID), { body });
      }
      if (Config.DEV_GUILD_ID) {
        const body = Array.from(this.devCommands.values())
          .map((cmd) => ({ name: cmd.name, description: cmd.description, options: cmd.options }));
        await rest.put(
          Routes.applicationGuildCommands(
            Config.BOT_CLIENT_ID,
            Config.DEV_GUILD_ID,
          ),
          { body },
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(err.message);
      }
    }
  }

  public async handle(name: string) {
    const commands = new Map([...this.devCommands, ...this.publicCommands]);
    const command = commands.get(name);
    if (!command) return null;
    return command;
  }
}
