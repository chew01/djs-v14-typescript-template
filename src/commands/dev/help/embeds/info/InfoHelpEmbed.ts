import { EmbedBuilder } from 'discord.js';

const InfoHelpEmbed = new EmbedBuilder({
  author: { name: '📖 Info Commands', iconURL: 'https://i.imgur.com/qYcgbPZ.jpg' },
  description: 'Info command to get bot statistics!',
  fields: [
    { name: 'info', value: '`/info`\n\nReplies with bot statistics.' },
  ],
});

export default InfoHelpEmbed;
