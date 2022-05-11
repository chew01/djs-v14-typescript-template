import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import log from 'loglevel';
import SlashCommand from '../types/SlashCommand';
import {
  BOT_CLIENT_ID, DEV_GUILD_ID, DEVELOPMENT_MODE, DISCORD_TOKEN,
} from '../config';
import logHelper from '../utils/logger';

export default class CommandHandler {
  private readonly devCommandBuilders: SlashCommandBuilder[];

  private readonly publicCommandBuilders: SlashCommandBuilder[];

  private commands: Map<string, SlashCommand>;

  public constructor() {
    this.devCommandBuilders = [];
    this.publicCommandBuilders = [];
    this.commands = new Map<string, SlashCommand>();
  }

  private async loadCommands(type: 'dev' | 'public', builders: SlashCommandBuilder[]) {
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
      const { builder } = await import(filepath);
      if (builder && builder instanceof SlashCommandBuilder) {
        builders.push(builder);
      } else throw new Error(`Command file ${filepath} does not contain valid builder.`);

      const command = await import(filepath);
      if (command.default && command.default instanceof SlashCommand) {
        this.commands.set(builder.name, command.default);
      } else throw new Error(`Command file ${filepath} does not export a valid slash command as default.`);
    })).then(() => logHelper.info(`${type === 'dev' ? `${this.devCommandBuilders.length} developer` : `${this.publicCommandBuilders.length} public`} commands loaded.`));
  }

  public async load() {
    if (!DEVELOPMENT_MODE) await this.loadCommands('public', this.publicCommandBuilders);
    await this.loadCommands('dev', this.devCommandBuilders);
  }

  public async update() {
    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

    try {
      if (this.publicCommandBuilders.length) {
        const body = this.publicCommandBuilders.map((builder) => builder.toJSON());
        await rest.put(Routes.applicationCommands(BOT_CLIENT_ID), { body });
      }
      if (DEV_GUILD_ID) {
        const body = this.devCommandBuilders.map((builder) => builder.toJSON());
        await rest.put(Routes.applicationGuildCommands(BOT_CLIENT_ID, DEV_GUILD_ID), { body });
      }
    } catch (err) {
      if (err instanceof Error) {
        logHelper.error(err.message);
      } else {
        log.error(err);
      }
    }
  }

  public async handle(name: string) {
    const command = this.commands.get(name);
    if (!command) return null;
    return command;
  }
}