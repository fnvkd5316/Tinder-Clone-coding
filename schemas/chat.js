const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  userId_A: {
    type: String,
    required: true,
  },
  userId_B: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Chat", ChatSchema);
