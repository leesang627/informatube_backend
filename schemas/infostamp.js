const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const infostampSchema = new Schema({
  stamper: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  url: {
    type: String,
  },
  info: {
    type: String,
  },
  time: {
    type: Number,
    required: true,
  },
  scroll: {
    type: Number,
    required: true,
  },
  likedUsers: [{
    type: ObjectId,
    ref: 'User',
  }],
  dislikedUsers: [{
    type: ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Infostamp', infostampSchema);