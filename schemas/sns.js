const mongoose = require("mongoose");

const SnsSchemas = new mongoose.Schema({
  snsId: {
    type: String,
    unique: true,
  },
  nick: {
    type: String,
  },
  provider: {
    type: String,
  },
});

module.exports = mongoose.model("Sns", SnsSchemas);
