import type { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export default abstract class SlashCommand {
  abstract builder: SlashCommandBuilder;
  abstract execute(interaction: CommandInteraction, ...args: any[]): any;

  public async run(interaction: CommandInteraction, ...args: any[]) {
    return this.execute(interaction, args);
  }
}
