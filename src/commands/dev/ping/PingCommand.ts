import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import SlashCommand from '../../../types/SlashCommand';

class PingCommand extends SlashCommand {
  builder: SlashCommandBuilder = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

  execute(interaction: CommandInteraction) {
    return interaction.reply('Ping!');
  }
}

export default new PingCommand();
