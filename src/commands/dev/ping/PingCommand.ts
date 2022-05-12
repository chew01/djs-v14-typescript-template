import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import SlashCommand from '../../../types/SlashCommand';

class PingCommand extends SlashCommand {
  async execute(interaction: CommandInteraction) {
    if (interaction.inCachedGuild()) {
      const deferCheck = await interaction.deferReply({ fetchReply: true });

      const CachedPingEmbed = new EmbedBuilder({
        title: 'Pong!',
        fields: [
          { name: 'API Latency', value: `${deferCheck.createdTimestamp - interaction.createdTimestamp}ms` },
          { name: 'Websocket Latency', value: `${interaction.client.ws.ping}ms` },
        ],
      });
      return interaction.editReply({ embeds: [CachedPingEmbed] });
    }

    const UncachedPingEmbed = new EmbedBuilder({
      title: 'Pong!',
      fields: [
        { name: 'Websocket Latency', value: `${interaction.client.ws.ping}ms` },
      ],
    });
    return interaction.editReply({ embeds: [UncachedPingEmbed] });
  }
}

export const builder = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export default new PingCommand();
