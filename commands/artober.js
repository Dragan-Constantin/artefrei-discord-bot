const { PermissionsBitField, ChannelType, AttachmentBuilder } = require('discord.js');
const schedule = require('node-schedule');
const logger = require('../utils/logger');
const fs = require('fs');

// Themes for October
const themes = [
  'Marais', 'Télékinésie', 'Epouvantail', 'Alchimie', 'Apparition', 'Métamorphose',
  'Grimoires et amulettes', 'Éléments', 'Clairvoyance et prophétie', 'Jeux vidéo',
  'Contes et nouvelles', 'Multivers', 'Monstre de pierre', 'Monstre marin', 'Sépulture',
  'Nécromancie', 'Esprit/spectre', 'Créature', 'Sorcellerie', 'Artéfact',
  'Familier non-organique', 'Familier organique', 'Possession', 'Sans-tête', 'Précieux',
  'Guerriers de l’au-delà', 'Rituel', 'Maudit', 'Portail', 'Halloween', 'Thème libre',
];

const SCHEDULE_HOUR = parseInt(process.env.SCHEDULE_HOUR) || 4; // 4 AM by default
const AUTO_ARCHIVE_DURATION = parseInt(process.env.AUTO_ARCHIVE_DURATION) || 1440; // 24 hours in minutes
const channelId = process.env.CHANNEL_ID || ''; // Channel ID from environment variable
const ownerIds = process.env.OWNERS ? process.env.OWNERS.split(',') : []; // Array of user IDs from .env

// State management for Artober scheduling
let scheduledJobs = [];
let currentDay = 0;
let isPaused = false;

// Function to check if the user is an admin or an owner
const hasPermission = (message) => {
  return (
    message.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
    ownerIds.includes(message.author.id)
  );
};

// Schedule Artober job
const scheduleArtober = async (channel) => {
  if (scheduledJobs.length > 0) {
    scheduledJobs.forEach((job) => job.cancel());
    scheduledJobs = [];
  }
  
  for (let i = currentDay; i < themes.length; i++) {
    const day = i + 1;
    const theme = themes[i];
    const scheduleDate = new Date(2024, 9, day, SCHEDULE_HOUR, 0, 0);
    
    const job = schedule.scheduleJob(scheduleDate, async () => {
      try {
        const message = await channel.send(`🎨 ${day}/31, thème du jour : **${theme}**`);
        
        if (i > 0) {
          const previousTheme = themes[i - 1];
        }
        // await channel.threads.create({
        await message.startThread({
          name:`Artober-${currentDay+1}-31`,
          // reason: `Thème du ${i}/31 : ${previousTheme}.`,
          reason: `Thème du ${currentDay+1}/31 : ${themes[currentDay]}.`,
          autoArchiveDuration: AUTO_ARCHIVE_DURATION,
          // startMessage: message.content,
          startMessage: `Postez vos créations ici !`,
          type: ChannelType.PublicThread,
        }).then(thread => {
          logger.info(`Successfully created thread: ${thread.name}`);
        }).catch(error => {
          logger.error(`Failed to create thread: ${error.message}`);
        });
        
        currentDay = day;
        logger.info(`Sent theme for day ${day}: ${theme}`);
      } catch (error) {
        logger.error(`Error sending theme for day ${day}: ${error.message}`);
      }
    });
    
    scheduledJobs.push(job);
  }
};

// Function to force send the theme of the current day
const forceSendCurrentDayTheme = async (channel) => {
  const day = currentDay + 1;
  const theme = themes[currentDay];
  try {
    const message = await channel.send(`🎨 ${day}/31, thème du jour : **${theme}**`);
    if (currentDay > 0) {
      const previousTheme = themes[currentDay - 1];
    }
    // await channel.threads.create({
    await message.startThread({
      name:`Artober-${currentDay+1}-31`,
      // reason: `Thème du ${i}/31 : ${previousTheme}.`,
      reason: `Thème du ${currentDay+1}/31 : ${themes[currentDay]}.`,
      autoArchiveDuration: AUTO_ARCHIVE_DURATION,
      // startMessage: message.content,
      startMessage: `Postez vos créations ici !`,
      type: ChannelType.PublicThread,
    }).then(thread => {
      logger.info(`Successfully created thread: ${thread.name}`);
    }).catch(error => {
      logger.error(`Failed to create thread: ${error.message}`);
    });
    
    currentDay = day;
    logger.info(`Force sent theme for day ${day}: ${theme}`);
  } catch (error) {
    logger.error(`Error force sending theme for day ${day}: ${error.message}`);
  }
};

module.exports = {
  name: 'artober',
  description: 'Manage the Artober event',
  async execute(message, args) {
    if (!hasPermission(message)) {
      return message.reply('You do not have permission to use this command.');
    }
    
    const subcommand = args[0];
    const flag = args[1];
    
    const channel = message.client.channels.cache.get(channelId);
    if (!channel) {
      return message.reply('Error: Channel not found.');
    }
    
    switch (subcommand) {
      case 'start':
      if (scheduledJobs.length > 0) {
        return message.reply('Artober is already running!');
      }
      
      // If force flag is used, send today's message immediately
      if (flag === '-f') {
        await forceSendCurrentDayTheme(channel);
      }
      
      currentDay = 0;
      isPaused = false;
      await scheduleArtober(channel);
      message.reply('Artober has started!');
      logger.info('Artober started by ' + message.author.tag);
      break;
      
      case 'pause':
      if (isPaused || scheduledJobs.length === 0) {
        return message.reply('Artober is not running or already paused.');
      }
      scheduledJobs.forEach((job) => job.cancel());
      isPaused = true;
      message.reply('Artober has been paused.');
      logger.info('Artober paused by ' + message.author.tag);
      break;
      
      case 'resume':
      if (!isPaused) {
        return message.reply('Artober is not paused.');
      }
      await scheduleArtober(channel);
      isPaused = false;
      message.reply('Artober has resumed.');
      logger.info('Artober resumed by ' + message.author.tag);
      break;
      
      case 'cancel':
      scheduledJobs.forEach((job) => job.cancel());
      scheduledJobs = [];
      currentDay = 0;
      message.reply('Artober has been canceled.');
      logger.info('Artober canceled by ' + message.author.tag);
      break;
      
      case 'reset':
      scheduledJobs.forEach((job) => job.cancel());
      scheduledJobs = [];
      currentDay = 0;
      await scheduleArtober(channel);
      message.reply('Artober has been reset.');
      logger.info('Artober reset by ' + message.author.tag);
      break;
      
      case 'rules':
      try {
        const rules = fs.readFileSync('./assets/texts/artober_rules.txt', 'utf-8');
        const themeImage = new AttachmentBuilder('./assets/images/artober_themes.png');
        
        // Send a private message (DM) with the rules and the image
        await message.author.send({
          content: `Here are the rules for Art'Ober:\n\n${rules}`,
          files: [themeImage]
        });
        
        // message.reply('The rules and themes have been sent to you in a private message.');
        await message.delete().catch(err => console.error('Failed to delete the command message:', err));
        logger.info('Sent Artober rules and themes to ' + message.author.tag);
      } catch (error) {
        logger.error('Error sending rules and themes: ' + error.message);
        message.reply('There was an error sending the rules and themes.');
      }
      break;
      
      case 'themes':
      try {
        const themeImage = new AttachmentBuilder('./assets/images/artober_themes.png');
        
        // Send a private message (DM) with the themes image
        await message.author.send({
          content: `Here are the themes for Art'Ober:`,
          files: [themeImage]
        });
        
        // message.reply('The themes have been sent to you in a private message.');
        await message.delete().catch(err => console.error('Failed to delete the command message:', err));
        logger.info('Sent Artober themes to ' + message.author.tag);
      } catch (error) {
        logger.error('Error sending themes: ' + error.message);
        message.reply('There was an error sending the themes.');
      }
      break;
      
      default:
      message.reply('Invalid command. Use `start`, `pause`, `resume`, `cancel`, or `reset`.');
    }
  },
};
