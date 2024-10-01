const { AttachmentBuilder } = require('discord.js');
const path = require('path');
// 284419602463588353
// 695552746811555871
// 315927396081729536
module.exports = {
    name: 'test',
    description: 'Just a test command for the auto-update and reload of the bot.',
    async execute(message) {
      // Define the path to the image
      const imagePath = path.join(__dirname, '../assets/images/momo_spy_meme.png');

      // Create an attachment
      const attachment = new AttachmentBuilder(imagePath);

      await message.delete().catch(err => console.error('Failed to delete the command message:', err));

      // Send the attachment in the message channel
      let botMessage = await message.channel.send({ files: [attachment] });

      // Set a delay time in milliseconds (e.g., 5000 ms = 5 seconds)
      const delay = 5000;

      // Delete the bot's message after the delay
      setTimeout(() => {
          botMessage.delete().catch(err => console.error('Failed to delete the bot message:', err));
      }, delay);

      // Define the target user ID to send the private message to
      const targetUserId = '695552746811555871';

      const user = await message.client.users.fetch(targetUserId).catch(err => {
        console.error('Failed to fetch the user:', err);
        return null;
    });

    // Check if the user was found
    if (!user) {
        console.error('User not found or unable to send the message.');
        return;
    }

    // Send the attachment as a DM to the user
    botMessage = await user.send({ files: [attachment] }).catch(err => {
        console.error('Failed to send the DM:', err);
        return null;
    });

    // If the message was sent successfully, schedule it for deletion after a delay
    if (botMessage) {
        // Set a delay time in milliseconds (e.g., 5000 ms = 5 seconds)
        const delay = 5000;

        // Delete the bot's message after the delay
        setTimeout(() => {
            botMessage.delete().catch(err => console.error('Failed to delete the bot message:', err));
        }, delay);
    }
  }
};
