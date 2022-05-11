import chalk from 'chalk';
import BotEventHandler from '../types/BotEventHandler';
import Logger from '../services/Logger';

const ReadyEventHandler = new BotEventHandler()
  .setName('ready')
  .setOnce(true)
  .setExecute((client) => {
    if (!client.user) return;
    Logger.info(chalk.green.bold(`Ready! Bot logged in as ${client.user.tag}`));
  });

export default ReadyEventHandler;
