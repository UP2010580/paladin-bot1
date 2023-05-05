module.exports = {
  name: 'ping',
  description: 'Pong!',
  // devOnly: Boolean, true defines as dev only, meaning only people's who's id's match the "Devs" array in config.json can execute this command
  // testOnly: Boolean, true defines as test only, meaning it can only be executed in the server with the ID that matches the "test" in config.json
  // deleted: Boolean, true defines a a deleted command, a deleted command will not be registered by the command handler upon startup

  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};
