const logger = require('../utils/logger'); // Import the logger
const ownerIds = process.env.OWNERS ? process.env.OWNERS.split(',') : []; // Array of owner IDs from .env

module.exports = {
  name: 'restart',
  description: 'Restarts the bot',
  async execute(message, args) {
    // Only allow the bot owner(s) or administrators to use this command
    if (
      !message.member.permissions.has('ADMINISTRATOR') &&
      !ownerIds.includes(message.author.id)
    ) {
      return message.reply('You do not have permission to restart the bot.');
    }

    try {
      await message.reply('Bot is restarting...');
      logger.info(`Bot restart initiated by ${message.author.tag}`);

      // Exit the process, which will trigger a restart if a suitable mechanism is in place
      process.exit(0); // Use 0 to indicate a successful exit
    } catch (error) {
      logger.error(`Error during bot restart: ${error.message}`);
      message.reply('An error occurred while attempting to restart the bot.');
    }
  },
};
