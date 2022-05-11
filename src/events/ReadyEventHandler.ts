import chalk from 'chalk';
import BotEventHandler from '../types/BotEventHandler';
import logHelper from '../utils/logger';

const ReadyEventHandler = new BotEventHandler()
  .setName('ready')
  .setOnce(true)
  .setExecute((client) => {
    if (!client.bot.user) return;
    logHelper.info(chalk.green.bold(`Ready! Bot logged in as ${client.bot.user.tag}`));
  });

export default ReadyEventHandler;
