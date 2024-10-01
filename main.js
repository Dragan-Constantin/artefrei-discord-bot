const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./utils/logger');
const { loadCommands, updateCommands } = require('./utils/update');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = process.env.PREFIX || '!';

// Log the bot starting up
logger.info('Starting Discord bot...');

// Initialize commands collection and load commands
client.commands = new Collection();
loadCommands(client);

client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

// Listen for messages
client.on('messageCreate', async (message) => {
  // Ignore messages from bots or messages that don't start with the prefix
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  // Parse the command and arguments
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Handle command reloading
  if (commandName === 'reload') {
    if (message.member.permissions.has('ADMINISTRATOR') && ownerIds.includes(message.author.id)) {  // Optional: only allow specific users
      updateCommands(client, message);
    } else {
      message.reply('You do not have permission to reload commands.');
    }
    return;
  }

  // Check if the command exists
  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  // Logging the command usage
  logger.info(`Command "${commandName}" used by ${message.author.tag}`);

  try {
    // Execute the command
    command.execute(message, args);
  } catch (error) {
    logger.error(`Error executing command "${commandName}": ${error.message}`);
    message.reply('There was an error executing that command!');
  }
});

// Login to Discord
client.login(process.env.BOT_TOKEN);
