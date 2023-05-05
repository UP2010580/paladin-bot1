const path = require('path');
const words = require('../models/bannedWords');
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
      const role = guild.roles.cache.find((role) => role.id === '1068136999644565585'); // You will need to change this to the role ID of the role you want to add to users upon joining
      member.roles.add(role).catch(console.error).then(() => {
        console.log('Assigned initial role');
      });
      if (words.some(word => member.user.username.includes(word))) {
        const modChannelID = '1068137279907975249';// Change this to a moderator channel.
        const modChannel = client.channels.cache.get(modChannelID);
        if (modChannel) {
          modChannel.send(`Kicked ${member.user.tag}`);
        }
        // kick the member if their username matches a word in the bannedWords array in bannedWords.json
        member.kick('Username contained a banned word').then(() => {
          console.log('Kicked most recent joiner.');
        });
      } else {
        const joinChannelID = '1068137279907975249'; // Change this to the same channel where users join
        const joinChannel = client.channels.cache.get(joinChannelID);
        console.log('Username is okay');
        if (joinChannel) {
          joinChannel.send(`Welcome to the server, ${member.toString()}, Please use /infoupdate to gain access!`);// you can change this message to anything
        }
      }
    });
  });
};
