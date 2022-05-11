import type { CommandInteraction } from 'discord.js';

type SlashExecuteFunction = (interaction: CommandInteraction, ...args: any[]) => Promise<any>;

export default class SlashCommand {
  private execute: SlashExecuteFunction;

  public constructor() {
    this.execute = async () => {};
  }

  public setFn(fn: SlashExecuteFunction) {
    this.execute = fn;
    return this;
  }

  public async run(interaction: CommandInteraction, ...args: any[]) {
    return this.execute(interaction, args);
  }
}
