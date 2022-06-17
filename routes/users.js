const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const multer = require("multer");
const authorization = require("../middlewares/authconfirm");
const User = require("../schemas/user");
require("dotenv").config();

router.post("/signup", async (req, res) => {
  try {
    const { userId, password, userName, userAge } = req.body;

    re_userId = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    re_password = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

    if (userId.include(re_userId) == false) {
      res.status(400).send({
        errormassage: "이메일 형식이 아닙니다",
      });
      return;
    }

    if (password.include(re_password) == false) {
      res.status(400).send({
        errormassage: "8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 입력해야 합니다",
      });
      return;
    }

    const existuser = await User.find({ $or: [{ userId }, { userName }] });
    if (existuser.lenght) {
      res.status(400).send({
        errormassage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
      return;
    }

    const userPassword = await hash(password, 10);

    const user = await User.create({
      userId,
      password,
      userName,
      userAges,
      userPassword,
      ImageUrl,
    });

    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send({
      errormassage: "데이터 형식이 맞이 않습니다.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    re_userId = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    re_password = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

    if (userId.include(re_userId) == false) {
      res.status(400).send({
        errormassage: "이메일 형식이 아닙니다.",
      });
      return;
    }
    if (password.include(re_password) == false) {
      res.status(400).send({
        errormassage: "8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 입력해야 합니다",
      });
      return;
    }

    const isValid = await compare(password, user.userPassword);
    if (!isValid) {
      res.status(400).send({
        errormassage: "아이디나 비밀번호를 다시 확인해 주세요",
      });
      return;
    }
    const token = jwt.sign({ userid: user.usr });
  } catch (error) {}
});

module.exports = router;
