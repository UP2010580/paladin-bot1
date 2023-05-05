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
    const year = currentYear;
    console.log('created guildID Constant');

    if (year >= 1 && year <= 6) {
      const roleIds = {
        1: '1103243689108721744', // Replace with the role ID for the first year
        2: '1103243646200991764',
        3: '1103243726215725116',
        4: '1103243689108721744',
        5: '1103243787951669299',
        6: '1103243860173406228',
      };
      console.log('Created role IDs array');
      const roleId = roleIds[currentYear];
      if (!roleId) {
        console.error(`No role ID found for year ${currentYear}`);
        return;
      }
      client.guilds
        .fetch(guildId)
        .then((guild) => {
          const role = guild.roles.cache.get(roleId);
          if (!role) {
            console.error(`Role with ID ${roleId} not found`);
            return;
          }
          const memberId = interaction.member.id;
          const member = guild.members.cache.get(memberId);
          if (!member) {
            console.error('Member not found');
            return;
          }
          member.roles
            .set([role])
          //              .add([ROLE_ID_HERE]) Uncomment this and change to Verified Student role ID
            .then(() => {
              console.log(`Assigned role ${role.name} to ${member.user.tag}`);
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
