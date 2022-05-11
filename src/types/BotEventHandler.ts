import type BotClient from '../BotClient';

type EventExecuteFunction = (bot: BotClient, ...args: any[]) => void;

export default class BotEventHandler {
  name: string;

  once: boolean;

  execute: EventExecuteFunction;

  public constructor() {
    this.name = '';
    this.once = false;
    this.execute = () => {};
  }

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setOnce(once: boolean) {
    this.once = once;
    return this;
  }

  public setExecute(fn: EventExecuteFunction) {
    this.execute = fn;
    return this;
  }
}
