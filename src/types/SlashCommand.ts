import type { CommandInteraction } from 'discord.js';

export default abstract class SlashCommand {
  abstract execute(interaction: CommandInteraction, ...args: any[]): any;

  public async run(interaction: CommandInteraction, ...args: any[]) {
    return this.execute(interaction, args);
  }
}
