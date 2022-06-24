const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userAge: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    //required: true,
  },
  refresh_token: {
    type: String,
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
  recommends: {
    type: Array,
    default: []
  },
  userIntro: {
    type: String,
    default: null,
  },
  workPlace: {
    type: String,
    default: null,
  },
  category: {
    type: Array,
    default: [],
  },
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});

const SelectSchema = Joi.object({
  selectId: Joi.string().required(),
  select: Joi.boolean().required()
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  SelectSchema,
}
