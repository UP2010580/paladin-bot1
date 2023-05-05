const { ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Student = require('../../models/student');
// Export the actual command
module.exports = {
  mongoose, // export the mongoose module
  name: 'infoupdate',
  description: 'Update the information stored.',
  options: [
    {
      name: 'up-number',
      description: 'Your UP Number, including UP',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'first-name',
      description: 'Your first name',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'last-name',
      description: 'Your last name',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'current-year',
      description: 'Your current year of study',
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'Foundation Year',
          value: '1',
        },
        {
          name: 'First Year',
          value: '2',
        },
        {
          name: 'Second Year',
          value: '3',
        },
        {
          name: 'Final Year',
          value: '4',
        },
        {
          name: 'Masters Student',
          value: 'Masters',
        },
        {
          name: 'pHd Student',
          value: 'pHd',
        },
      ],
      required: true,
    },
    {
      name: 'course-code',
      description: 'Your course code',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'graduation-status',
      description: 'Your graduation status, true if you have graduated',
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    },
  ],
  // handle the interaction
  callback: async (client, interaction, mongoose) => {
    const upNumber = interaction.options.getString('up-number');
    const firstName = interaction.options.getString('first-name');
    const lastName = interaction.options.getString('last-name');
    const currentYear = interaction.options.getString('current-year');
    const courseCode = interaction.options.getString('course-code');
    const graduationStatus =
      interaction.options.getBoolean('graduation-status');
    interaction.reply('Information collected, thank you!');
    console.log(`UP Number: ${upNumber}
        First Name: ${firstName}
        Last Name: ${lastName}
        Current Year: ${currentYear}
        Course Code: ${courseCode}
        Graduation Status: ${graduationStatus}`);
    const newName = `${firstName} ${lastName.charAt(0)}/${upNumber}`;
    const guildMember = await interaction.guild.members.fetch(
      interaction.user.id,
    );

    await guildMember.setNickname(newName);
    console.log('Nickname set');

    // Connect to MongoDB
    mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to MongoDB!');
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
      });
    // Define the document schema
    const studentSchema = new Schema({
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      courseCode: {
        type: String,
        required: true,
      },
      currentYear: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      upNumber: {
        type: String,
        required: true,
      },
    });
    module.exports = mongoose.model('Student', studentSchema);
    // if schema exists, delete it
    if (mongoose.connection.models.Student) {
      delete mongoose.connection.models.Student;
    }
    // Create a new student document and save it to the database
    const newStudent = new Student({
      _id: `${upNumber}`,
      courseCode: `${courseCode}`,
      currentYear: `${currentYear}`,
      firstName: `${firstName}`,
      lastName: `${lastName}`,
    });

    newStudent
      .save()
      .then(() => {
        console.log('Student saved to database');
      })
      .catch((error) => {
        console.log(`There was an error saving: ${error}`);
      });

    const guildId = process.env.GUILD_ID;
    console.log('created guildID Constant');

    if (currentYear >= 1 && currentYear <= 6) {
      const roleIdArray = {
        1: '1103243689108721744', // Replace with desired role IDs
        2: '1103243646200991764',
        3: '1103243726215725116',
        4: '1103243757379387472',
        5: '1103243787951669299',
        6: '1103243860173406228',
      };
      console.log('Created role IDs array');
      console.log(roleIdArray);
      console.log(currentYear);
      const roleId = roleIdArray[currentYear];
      console.log(roleId);
      if (!roleId) {
        console.log(`No role ID found for year ${currentYear}`);
        return;
      }
      client.guilds
        .fetch(guildId)
        .then((guild) => {
          if (!roleId) {
            console.log(`Role with ID ${roleId} not found`);
            return;
          }
          const memberId = interaction.member.id;
          const member = guild.members.cache.get(memberId);
          const initialRole = '1068136999644565585';// You will need to change this to the same ID as your initial role.
          if (!member) {
            console.log('Member not found');
            return;
          }
          console.log(roleId);
          member.roles.add([roleId]);
          member.roles.remove([initialRole])
            .then(() => {
              console.log(`Assigned role ${roleId.name} to ${member.user.tag}`);
            })
            .catch((error) => {
              console.error(`Error assigning role: ${error}`);
            });
        })
        .catch((error) => {
          console.error(`Error fetching guild: ${error}`);
        });
    }
  },
};
