const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const logger = require('./logger');

// Function to load commands
const loadCommands = (client) => {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  // Clear previous commands
  client.commands.clear();

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
  }

  logger.info('Commands loaded successfully.');
};

// Function to pull changes from GitHub and reload commands
const updateCommands = (client, message) => {
  exec('git pull origin main', (err, stdout, stderr) => {
    if (err) {
      logger.error(`Git pull error: ${stderr}`);
      if (message) message.reply('Failed to pull the latest changes.');
      return;
    }

    logger.info(`Git pull output: ${stdout}`);

    // Reload commands after pulling
    loadCommands(client);
    if (message) message.reply('Commands have been reloaded successfully!');
  });
};

module.exports = {
  loadCommands,
  updateCommands
};
