module.exports = {
  name: 'help',
  description: 'List all available commands',
  execute(message, args) {
    // Only allow the bot owner(s) or administrators to use this command
    if (
      !message.member.permissions.has('ADMINISTRATOR') &&
      !ownerIds.includes(message.author.id)
    ) {
      return message.reply('You do not have permission to restart the bot.');
    }
    const commands = message.client.commands;
    let helpMessage = 'Here is a list of available commands:\n- **update**: Dynamically updates the bot from GitHub (commands only atm)\n';
    
    commands.forEach(command => {
      helpMessage += `- **${command.name}**: ${command.description}\n`;
    });
    
    message.channel.send(helpMessage);
  },
};
