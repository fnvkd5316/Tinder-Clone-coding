const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userId_A: {
    type: String,
    required: true,
  },
  userId_B: {
    type: String,
    required: true,
  }
});

UserSchema.virtual("chatId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Chat", ChatSchema);