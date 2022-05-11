import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import SlashCommand from '../../../types/SlashCommand';

class PingCommand extends SlashCommand {
  execute(interaction: CommandInteraction) {
    return interaction.reply('Ping!');
  }
}

export const builder = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export default new PingCommand();
