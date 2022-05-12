import 'dotenv/config';
import type { GatewayIntentsString } from 'discord.js';

const GatewayIntents = require('../config/GatewayIntents.json');

export default class Config {
  private static populateConfig() {
    if (!process.env['DISCORD_TOKEN']) throw new Error('No bot token was provided!');
    const { DISCORD_TOKEN, DEV_GUILD_ID } = process.env;

    const encryptedClientId = DISCORD_TOKEN.split('.')[0];
    if (!encryptedClientId) throw new Error('Invalid bot token!');
    const BOT_CLIENT_ID = Buffer.from(encryptedClientId, 'base64').toString();

    const DEVELOPMENT_MODE = process.env['DEVELOPMENT_MODE'] !== 'FALSE';
    return {
      DISCORD_TOKEN, DEV_GUILD_ID, BOT_CLIENT_ID, DEVELOPMENT_MODE,
    };
  }

  static DISCORD_TOKEN: string = Config.populateConfig().DISCORD_TOKEN;

  static DEV_GUILD_ID: string | undefined = Config.populateConfig().DEV_GUILD_ID;

  static BOT_CLIENT_ID: string = Config.populateConfig().BOT_CLIENT_ID;

  static DEVELOPMENT_MODE: boolean = Config.populateConfig().DEVELOPMENT_MODE;

  static GATEWAY_INTENTS: GatewayIntentsString[] = GatewayIntents.intents;
}
