import 'dotenv/config';
import type { GatewayIntentsString } from 'discord.js';

if (!process.env['DISCORD_TOKEN']) throw new Error('No bot token was provided!');
export const { DISCORD_TOKEN, DEV_GUILD_ID } = process.env;

const encryptedClientId = DISCORD_TOKEN.split('.')[0];
if (!encryptedClientId) throw new Error('Invalid bot token!');
export const BOT_CLIENT_ID = Buffer.from(encryptedClientId, 'base64').toString();

export const DEVELOPMENT_MODE = process.env['DEVELOPMENT_MODE'] !== 'FALSE';
export const GATEWAY_INTENTS: GatewayIntentsString[] = [
  'DirectMessages',
  'Guilds',
  'GuildMessages',
];
