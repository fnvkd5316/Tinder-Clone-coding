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

<<<<<<< HEAD
module.exports = mongoose.model("Chat", ChatSchema);
=======
ChatSchema.virtual("chatId").get(function () {
  return this._id.toHexString();
});
ChatSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Chat", ChatSchema);
>>>>>>> 3616ab37948a66964c067e46ec92c191663edba2
