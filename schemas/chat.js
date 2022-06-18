const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userId_A: {
    type: String,
    required: true,
  },
  userId_B: {
    type: String,
    required: true,
  },
});

ChatSchema.virtual("chatId").get(function () {
  return this._id.toHexString();
});
ChatSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Chat", ChatSchema);
