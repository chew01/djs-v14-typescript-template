# Discord.js V14 Template (Lightweight)

This is a lightweight boilerplate for Discord.js v14 (dev) in Typescript.

### Features

- Type definitions for SlashCommands and EventHandlers
- 2 basic events ('ready', 'interactionCreate')
- 3 basic commands (`/ping`, `/info`, `/help`)
- Pretty-formatted logging with levels via [pino](https://github.com/pinojs/pino)

### Prerequisites

- [Node 16.14.0 and above](https://nodejs.org)

### Usage
1. Install the prerequisites, including a package manager of your choice (this guide uses [npm](https://www.npmjs.com/))
2. Edit .env file and change any intents in config/GatewayIntents.json
3. Run the bot with `npm run bot`

To run the bot in development watch mode (restart on every change), use `npm run watch`