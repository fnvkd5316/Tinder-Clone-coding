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
<<<<<<< HEAD
  },
  userAge: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
    required: true,
=======
    unique: true,
  },
  userAge: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required:true,
>>>>>>> 62395b61cca9d00864ed90f8d8151bd85f97ce5a
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
<<<<<<< HEAD
  },
});

module.exports = { User: mongoose.model("User", UserSchema) };
=======
  }
});

module.exports = mongoose.model("User", UserSchema);
>>>>>>> 62395b61cca9d00864ed90f8d8151bd85f97ce5a
