# Art'Efrei Discord Bot

This is a Discord bot built using Node.js for the EFREI Student Association **Art'Efrei**. It provides various functionalities that can be extended by commands placed in the `commands` folder. This bot can be run locally or in a Docker container.

## Features

- Command-based structure
- Docker support for containerized deployment
- Cross-platform restart scripts for ease of use
- Configurable environment variables

## Prerequisites

- [Node.js](https://nodejs.org/) (v21.x or later)
- [npm](https://www.npmjs.com/get-npm)
- Discord bot token (create a bot on the [Discord Developer Portal](https://discord.com/developers/applications))

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dragan-Constantin/artefrei-discord-bot
   cd artefrei-discord-bot
   ```
2. Install the dependencies:

   ```bash
   npm install
   ```
3. Create an `.env` file based on `.env.example` and configure your environment variables:

   ```bash
   cp .env.example .env
   ```
4. Start the bot:

   ```bash
   npm start
   ```

## Docker Usage

To build and run the bot using Docker:

1. Build the Docker image:

   ```bash
   docker build -t artefrei/bot .
   ```
2. Run the Docker container:

   ```bash
   docker run -d -p 3000:3000 --env-file .env --name artefrei_bot artefrei/bot
   ```

## Restarting the Bot

For convenience, there are two scripts available to restart the bot:

- For Windows: `restart-bot.bat`
- For Linux/MacOS: `restart-bot.sh`

## Folder Structure

- **commands/**: Contains individual command scripts for the bot.
- **logs/**: Stores log files for debugging and monitoring.
- **utils/**: Helper utilities and modules.

## Documentation

For more information about the inner working of the code, please look at the [documentation](./DOCUMENTATION.md).

## Contributing

Feel free to contribute by opening issues or submitting pull requests.

## License

This project is licensed under the [MIT License](./LICENSE).
