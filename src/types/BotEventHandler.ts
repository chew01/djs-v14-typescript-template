import type ExtendedClient from '../ExtendedClient';

export default abstract class BotEventHandler {
  abstract name: string;

  abstract once: boolean;

  abstract execute(client: ExtendedClient, ...args: any[]): any;
}
