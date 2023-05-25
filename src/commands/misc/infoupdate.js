const { ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();
const codes = require('../../models/courseCodes');
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
  // handle the interaction, the command handler is listening for the callback function
  callback: async (client, interaction, mongoose) => { // first, define constants that will be used later
    const upNumber = interaction.options.getString('up-number');
    const firstName = interaction.options.getString('first-name');
    const lastName = interaction.options.getString('last-name');
    const currentYear = interaction.options.getString('current-year');
    const courseCode = interaction.options.getString('course-code');
    const member = interaction.member;
    const graduationStatus =
      interaction.options.getBoolean('graduation-status');
    interaction.reply('Information collected, thank you!');
    console.log(`UP Number: ${upNumber}
        First Name: ${firstName}
        Last Name: ${lastName}
        Current Year: ${currentYear}
        Course Code: ${courseCode}
        Graduation Status: ${graduationStatus}`); // log the information, allowing for debugging if required
    const newName = `${firstName} ${lastName.charAt(0)}/${upNumber}`; // logic for creating the nickname in the server, this takes the first name, first letter of 2nd name and UP number
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
      graduationStatus: {
        type: Boolean,
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
    mongoose.model('Student', studentSchema);
    // if this schema exists, delete it to be replaced (it will be the same)
    if (mongoose.connection.models.Student) {
      delete mongoose.connection.models.Student;
    }
    // Create a new student document and save it to the database
    const newStudent = new Student({
      _id: `${upNumber}`,
      courseCode: `${courseCode}`,
      currentYear: `${currentYear}`,
      graduationStatus: `${graduationStatus}`,
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

    console.log('created guildID Constant');

    // Loop through the array of words
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      // Check if courseCode matches the current word
      if (courseCode === code) {
        // Perform a different action for each course code in the courseCodes.js file
        switch (code) {
          case 'G600': // Change to match the entry in ../../models/courseCodes
            try {
              const softwareEngineerRoleID = '1103876372222447747'; // G600 is the software engineering course code, so add software engineering role. Change as appropriate
              await guildMember.roles.add(interaction.guild.roles.cache.get(softwareEngineerRoleID));
              console.log(`Assigned role ${softwareEngineerRoleID} to ${member.user.tag}`);
            } catch (error) {
              console.log(error);
              console.log(`Error assigning role: ${error}`);
            }
            break;
          case 'other':
            // Do something for next code, most likely add a different role, if so copy the above trycatch block, paste here and edit as necessary
            console.log('Second role');
            break;// Add more cases for other words as needed
        }
        // If courseCode matches a course code defined in courseCodes.js, exit the loop to prevent unnecessary comparisons
        break;
      } else if (i === codes.length - 1) {
        // If courseCode doesn't match any course code defined in courseCodes.js, perform some default action, it could be to send a message to a channel the user will be able to see perhaps
        console.log(`No role assigned for course code ${courseCode}`);
      }
    }
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
      const guildMember = await interaction.guild.members.fetch(interaction.user.id);
      const roleId = roleIdArray[currentYear];
      if (!roleId) {
        console.log(`No role ID found for year ${currentYear}`);
        return;
      }
      const initialRole = '1068136999644565585';// You will need to change this to the same ID as your initial role.
      if (!member) {
        console.log('Member not found');
        return;
      }
      try { // try remove initial role and assign course role to allow server access, catch an error for degugging
        await guildMember.roles.add(interaction.guild.roles.cache.get(roleId));
        console.log(`Assigned role ${roleId} to ${member.user.tag}`);
        member.roles.remove([initialRole]);
        console.log(`Removed role ${initialRole} from ${member.user.tag}`);
      } catch (error) {
        console.log(error);
        console.log(`Error assigning role: ${error}`);
      }
    }
  },
};
