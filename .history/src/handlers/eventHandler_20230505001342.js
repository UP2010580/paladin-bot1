const path = require('path');
const words = require('../models/bannedWords.json');
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


  client.on(Events.GuildMemberAdd, (member) => { // every time a user joins
    console.log('User joined'); // log for testing (remove in final)
    client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
      const role = guild.roles.cache.find((role) => role.id === '1068136999644565585'); // YOU WILL NEED TO CHANGE THIS TO THE ROLE YOU WANT!
      member.roles.add(role).catch(console.error).then(() => {
        console.log('Assigned initial role');
        // check if any banned words are included in the user's username
        const bannedWords = Array.isArray(words) ? words : [words];// check if banned words is an array
        console.log('Checked bannedWords is an array');
        const username = member.user.username.toLowerCase();
        if (bannedWords.some(word => username.includes(word.toString().toLowerCase()))) {
          // kick the member if their username matches a word in the bannedWords array in bannedWords.json
          console.log('Kicking the user that joined, their username contains a banned word.');
          member.kick('Username contained a banned word');
        }
      });
    });
  });
};
