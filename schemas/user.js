const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  likedInfostamps: [{
    type: ObjectId,
    ref: 'Infostamp',
  }],
  dislikedInfostamps: [{
    type: ObjectId,
    ref: 'Infostamp',
  }],
})

module.exports = mongoose.model('User', userSchema);