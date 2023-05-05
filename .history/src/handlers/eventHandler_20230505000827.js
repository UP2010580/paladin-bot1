const path = require('path');
const bannedWords = require('../models/bannedWords.json');
require('dotenv').config();
const getAllFiles = require('../utils/getAllFiles');
const { Events } = require('discord.js');
module.exports = (client) => {
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

  client.on(Events.GuildMemberAdd, (member) => {
    console.log('User joined');
    client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
      const role = guild.roles.cache.find((role) => role.id === '1068136999644565585');
      member.roles.add(role).catch(console.error).then(() => {
        console.log('Assigned initial role');
        const username = member.user.username.toLowerCase();
        if (bannedWords.some(word => username.includes(word))) {
          console.log('Kicking the user that joined, their username contains a banned word.');
          member.kick('Username contained a banned word');
        }
      });
    });
  });
};
