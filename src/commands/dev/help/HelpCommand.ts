import {
  ActionRowBuilder,
  CommandInteraction,
  EmbedBuilder,
  MessageComponentInteraction,
  SelectMenuBuilder,
  SelectMenuInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import SlashCommand from '../../../types/SlashCommand';
import PingHelpEmbed from './embeds/ping/PingHelpEmbed';
import InfoHelpEmbed from './embeds/info/InfoHelpEmbed';

const MainEmbed = new EmbedBuilder({
  author: { name: "Taihou's Helpdesk", iconURL: 'https://i.imgur.com/qYcgbPZ.jpg' },
  description: "Welcome to Taihou's Helpdesk! Here are the things that you can ask Taihou to do!",
  fields: [
    { name: '🏓 Ping', value: 'Ping command to test bot responsiveness!' },
    { name: '📖 Info', value: 'Info command to get bot statistics!' },
  ],
});

const HelpSelector = new SelectMenuBuilder({
  customId: 'help-selector',
  options: [
    { label: 'Helpdesk', value: 'main', emoji: '❔' },
    { label: 'Ping command', value: 'ping', emoji: '🏓' },
    { label: 'Info command', value: 'info', emoji: '📖' },
  ],
  placeholder: 'Choose a category',
});

const HelpActionRow = new ActionRowBuilder<SelectMenuBuilder>({ components: [HelpSelector] });

class HelpCommand extends SlashCommand {
  public async execute(interaction: CommandInteraction) {
    if (interaction.inCachedGuild()) {
      const helpMessage = await interaction.reply(
        { embeds: [MainEmbed], components: [HelpActionRow], fetchReply: true },
      );

      const filter = (i: MessageComponentInteraction) => i.customId === 'help-selector' && i.user.id === interaction.user.id;

      const collector = helpMessage.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async (i: SelectMenuInteraction) => {
        const selected = i.values[0];

        switch (selected) {
          case 'main':
            await i.update({ embeds: [MainEmbed] });
            break;
          case 'ping':
            await i.update({ embeds: [PingHelpEmbed] });
            break;
          case 'info':
            await i.update({ embeds: [InfoHelpEmbed] });
            break;
          default:
            break;
        }
        collector.resetTimer();
      });

      collector.on('end', (_, reason) => {
        helpMessage.edit({ components: [] });
        if (reason === 'time' && helpMessage.embeds[0]) {
          helpMessage.edit({ embeds: [new EmbedBuilder(helpMessage.embeds[0].data).setFooter({ text: 'Command timed out! Use the /help command again for command help.' })] });
        }
      });
    }
  }
}

export const builder = new SlashCommandBuilder().setName('help').setDescription('Replies with bot info!');

export default new HelpCommand();
