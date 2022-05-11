import { SlashCommandBuilder } from 'discord.js';
import SlashCommand from '../../../types/SlashCommand';

export const builder = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

const PingCommand = new SlashCommand().setFn(async (interaction) => interaction.reply('Pong!'));

export default PingCommand;
