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
  },
  userAge: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
    required: true,
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
  },
});

module.exports = { User: mongoose.model("User", UserSchema) };
