import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import SlashCommand from '../../../types/SlashCommand';
import MathUtils from '../../../utils/MathUtils';

dayjs.extend(duration);

class InfoCommand extends SlashCommand {
  async execute(interaction: CommandInteraction) {
    const usage = process.memoryUsage();
    const totalGuilds = interaction.client.guilds.cache.size.toString();
    const totalChannels = interaction.client.channels.cache.size.toString();
    const cachedMembers = interaction.client.users.cache.size.toString();
    const nodeVersion = process.version;
    const uptime = dayjs.duration(interaction.client.uptime as number).format('D[d] H[h] m[m] s[s]');
    const usageStats = `**RSS**: ${MathUtils.formatBytes(usage.rss)}\n**Heap Total**: ${MathUtils.formatBytes(usage.heapTotal)}\n**Heap Used** ${MathUtils.formatBytes(usage.heapUsed)}`;

    const InfoEmbed = new EmbedBuilder({
      fields: [
        { name: 'Total Guilds', value: totalGuilds, inline: true },
        { name: 'Total Channels', value: totalChannels, inline: true },
        { name: 'Cached Members', value: cachedMembers, inline: true },
        { name: 'Node Version', value: nodeVersion, inline: true },
        { name: 'Bot Uptime', value: uptime, inline: true },
        { name: 'Memory Usage', value: usageStats, inline: true },
      ],
      author: { name: 'Taihou Statistics', iconURL: 'https://i.imgur.com/qYcgbPZ.jpg' },
    });

    return interaction.reply({ embeds: [InfoEmbed] });
  }
}

export const builder = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Replies with bot statistics.');

export default new InfoCommand();
