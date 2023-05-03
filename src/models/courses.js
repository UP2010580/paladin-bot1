const { Schema } = require('mongoose');
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to Courses DB');
}).catch((err) => {
  console.error('Error connecting to DB:', err);
});

const coursesSchema = new Schema({
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    courseCode: {
      type: String,
      required: true
    },
    courseTitle: {
      type: String,
      required: true
    },
    optionalModule1: {
      type: String,
      required: true
    },
    optionalModule2: {
      type: String,
      required: true
    },
    optionalModule3: {
      type: String,
      required: true
    }
  });

module.exports = mongoose.model('Courses', coursesSchema);

if (mongoose.connection.models['Courses']) {
  delete mongoose.connection.models['Courses'];
}