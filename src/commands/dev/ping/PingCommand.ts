import {
  ApplicationCommandOptionData,
  CommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import SlashCommand from '../../../types/SlashCommand';

class PingCommand extends SlashCommand {
  public name: string = 'ping';

  public description: string = 'Replies with Pong!';

  public options: ApplicationCommandOptionData[] = [];

  async run(interaction: CommandInteraction) {
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

export default new PingCommand();
