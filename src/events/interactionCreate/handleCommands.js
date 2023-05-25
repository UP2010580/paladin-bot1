const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const mongoose = require('mongoose');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName,
    );

    if (!commandObject) return;
    // check if the command is dev only, and that the user of the command is a developper
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Only developers are allowed to run this command.',
          ephemeral: true,
        });
        return;
      }
    }
    // check if the command is test only, and that the server it is used in is the test server
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'This command cannot be ran here.',
          ephemeral: true,
        });
        return;
      }
    }
    // check the permissions of the comman user, and if they are great enough
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'You don not have required permissions.',
            ephemeral: true,
          });
          return;
        }
      }
    }
    // check if the bot has enough permissions to execute a command
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }
    // each comman needs to have it's function called "callback", this allows the command handler to listen to it
    await commandObject.callback(client, interaction, mongoose);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
