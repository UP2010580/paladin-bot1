const { Schema } = require('mongoose');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to Student DB');
}).catch((err) => {
  console.error('Error connecting to Student DB', err);
});

const studentSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[uU][pP]\d{6,10}$/.test(v);
      },
      message: props => `${props.value} is not a valid UP number!`,
    },
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
});

// If student schema already exists, delete it and later replace it.

module.exports = mongoose.model('Student', studentSchema);

if (mongoose.connection.models.Student) {
  delete mongoose.connection.models.Student;
}
