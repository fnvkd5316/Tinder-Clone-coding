const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../schemas/user");



router.post("/signup", async (req, res) => {
  const {userId, nickName} = req.body;

  const oldUser = await User.find({ $or: [{ userId }, { nickName }], });

  res.status(200).send({
    result: "success",
  });
});



module.exports = router;