const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./utils/logger');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = process.env.PREFIX || '!'

// Log the bot starting up
logger.info('Starting Discord bot...');

// Command handler setup
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  // console.log(`Logged in as ${client.user.tag}!`);
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  // Ignore messages from bots or messages that don't start with the prefix
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  // Parse the command and arguments
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  // Logging the command usage
  logger.info(`Command "${commandName}" used by ${message.author.tag}`);

  try {
    command.execute(message, args);
  } catch (error) {
    // console.error(error);
    logger.error(`Error executing command "${commandName}": ${error.message}`);
    message.reply('There was an error executing that command!');
  }
});

client.login(process.env.BOT_TOKEN);
