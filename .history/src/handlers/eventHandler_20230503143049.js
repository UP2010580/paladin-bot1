const path = require('path');
require('dotenv').config();
const getAllFiles = require('../utils/getAllFiles');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const {
  Client,
  Guild,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  ApplicationCommandOptionType,
  Events,
} = require('discord.js');
module.exports = (client) => {
  const guildId = (process.env.GUILD_ID);
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }

  client.on(Events.GuildMemberAdd, async (member) => {
    console.log('User joined');
    console.log(member.id);
    client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
      const role = guild.roles.cache.find((role) => role.id === '1068136999644565585'); // YOU WILL NEED TO CHANGE THIS TO THE ROLE YOU WANT!
      member.edit({ roles: [role.id] }).then(() => {
        console.log('Assigned initial role');
      });
    });
  });
};
