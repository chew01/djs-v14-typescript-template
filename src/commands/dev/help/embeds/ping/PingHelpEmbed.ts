import { EmbedBuilder } from 'discord.js';

const PingHelpEmbed = new EmbedBuilder({
  author: { name: '🏓 Ping Commands', iconURL: 'https://i.imgur.com/qYcgbPZ.jpg' },
  description: 'Ping command to test bot responsiveness!',
  fields: [
    { name: 'ping', value: '`/ping`\n\nReplies with Pong!' },
  ],
});

export default PingHelpEmbed;
