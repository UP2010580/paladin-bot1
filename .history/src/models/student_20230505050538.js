const mongoose = require('mongoose');
require('dotenv').config();
const { Schema } = mongoose;

const studentSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[uU][pP]\d{6,10}$/.test(v);// Regex to validate UP number is real. Must begin with UP or up and contain between 6 and 10 numbers after.
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

module.exports = studentSchema;