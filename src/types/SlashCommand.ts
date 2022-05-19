import type {
  ApplicationCommandOptionData,
  ChatInputApplicationCommandData,
  CommandInteraction,
} from 'discord.js';

export default abstract class SlashCommand implements ChatInputApplicationCommandData {
  abstract name: string;

  abstract description: string;

  abstract options: ApplicationCommandOptionData[];

  abstract run(interaction: CommandInteraction, ...args: any[]): any;
}
