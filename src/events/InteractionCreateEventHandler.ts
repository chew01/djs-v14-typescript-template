import type { CommandInteraction } from 'discord.js';
import log from 'loglevel';
import BotEventHandler from '../types/BotEventHandler';
import logHelper, { logCommand } from '../utils/logger';

const InteractionCreateEventHandler = new BotEventHandler()
  .setName('interactionCreate')
  .setExecute(async (client, interaction: CommandInteraction) => {
    if (interaction.isCommand()) {
      logCommand(interaction, 'Trigger', interaction.commandName);
      const slashCommand = await client.commands.handle(interaction.commandName);

      // Slash command does not exist
      if (!slashCommand) {
        logCommand(interaction, 'Missing', interaction.commandName);
        return interaction.reply({ content: 'Oops! Command does not exist!', ephemeral: true });
      }

      try {
        await slashCommand.run(interaction);
        return logCommand(interaction, 'Success', interaction.commandName);
      } catch (err) {
        logCommand(interaction, 'Failure', interaction.commandName);
        await interaction.reply({ content: 'Uh oh! We were unable to execute your command.', ephemeral: true });
        if (err instanceof Error) {
          return logHelper.error(err.stack || err.message);
        }
        return log.error(err);
      }
    }
    return null;
  });

export default InteractionCreateEventHandler;
