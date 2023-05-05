const configDb = require('../models/MemberLog');

async function loadConfig(client) {
  (await configDb.find()).forEach((doc) => {
    client.guildConfig.set(doc.Guild, {
      logChannel: doc.logChannel,
      memberRole: doc.memberRole,
      botRole: doc.botRole,
    });
  });
  return console.log('Loaded guild configurations to the collection.');
}

module.exports = { loadConfig };
