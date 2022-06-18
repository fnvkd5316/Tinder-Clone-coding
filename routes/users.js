const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const authMiddlewares = require("../middlewares/authconfirm");
const User = require("../schemas/user");
require("dotenv").config();

const upload = multer({
  dest: "static/",
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./static");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
    fileFilter: (req, file, cb) => {
      if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) cd(null, true);
      else cd(Error("PNG, jpeg만 업로드 하세요"), false);
    },
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }),
});

router.post("/signup", upload.single("imageUrl"), async (req, res) => {
  try {
    const { userEmail, password, userName, userAge } = req.body;

    const re_userEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const re_password = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

    if (userId.search(re_userEmail) == -1) {
      res.status(400).send({
        errormassage: "이메일 형식이 아닙니다",
      });
      return;
    }

    if (password.search(re_password) == -1) {
      res.status(400).send({
        errormassage: "8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 입력해야 합니다",
      });
      return;
    }

    const existuser = await User.find({ $or: [{ userEmail }, { userName }] });
    if (existuser.length) {
      res.status(400).send({
        errormassage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
      return;
    }

    const userPassword = await hash(password, 10);
    const imageUrl = req.file.filename;
    const user = await User.create({ userEmail, userPassword, userName, userAge, imageUrl });
    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send({
      errormassage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const user = await User.findOne({ userId });
    const re_userEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const re_password = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

    if (userEmail.search(re_userEmail) == -1) {
      res.status(400).send({
        errormassage: "이메일 형식이 아닙니다.",
      });
      return;
    }
    if (password.search(re_password) == -1) {
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
    const token = jwt.sign({ userId: user.userId, imageUrl: user.imageUrl }, process.env.SECRET_KEY, { expiresIn: "6h" });
    res.status(201).send({ token });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errormassage: "아이디 또는 비밀번호를 확인해주세요",
    });
  }
});

router.get("/auth", authMiddlewares, async (req, res) => {
  try {
    const { user } = res.locals;
    res.status(200).send({
      user: { userId: user.id },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errormassage: "사용자 정보를 가져오지 못하였습니다.",
    });
  }
});

module.exports = router;
