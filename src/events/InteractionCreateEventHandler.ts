import type { CommandInteraction } from 'discord.js';
import BotEventHandler from '../types/BotEventHandler';
import Logger from '../services/Logger';

const InteractionCreateEventHandler = new BotEventHandler()
  .setName('interactionCreate')
  .setExecute(async (client, interaction: CommandInteraction) => {
    if (interaction.isCommand()) {
      Logger.logCommand(interaction, 'Trigger', interaction.commandName);
      const slashCommand = await client.commands.handle(interaction.commandName);

      // Slash command does not exist
      if (!slashCommand) {
        Logger.logCommand(interaction, 'Missing', interaction.commandName);
        return interaction.reply({ content: 'Oops! Command does not exist!', ephemeral: true });
      }

      try {
        await slashCommand.run(interaction);
        return Logger.logCommand(interaction, 'Success', interaction.commandName);
      } catch (err) {
        Logger.logCommand(interaction, 'Failure', interaction.commandName);
        await interaction.reply({ content: 'Uh oh! We were unable to execute your command.', ephemeral: true });
        if (err instanceof Error) {
          return Logger.error(err.stack || err.message);
        }
      }
    }
    return null;
  });

export default InteractionCreateEventHandler;
