const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  userAge: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required:true,
  },
  like: {
    type: Array,
    default: [],
  },
  likeMe: {
    type: Array,
    default: [],
  },
  bad: {
    type: Array,
    default: [],
  },
  badMe: {
    type: Array,
    default: [],
  }
});

module.exports = mongoose.model("User", UserSchema);