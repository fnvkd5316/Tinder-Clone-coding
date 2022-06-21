const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const authMiddlewares = require("../middlewares/authconfirm");
const User = require("../schemas/user");
const fs = require("fs");
require("dotenv").config();

const upload = multer({
  dest: "static/",
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./static");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      // cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      cb(null, Date.now() + ext);
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

    if (userEmail.search(re_userEmail) == -1) {
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

    const existuser = await User.find({ userEmail });
    if (existuser.length) {
      res.status(400).send({
        errormassage: "해당 이메일은 이미 가입된 이메일입니다.",
      });
      return;
    }
  
    const userPassword = await hash(password, 10);
    const imageUrl = req.file.filename;
    const user = await User.create({ userEmail, userPassword, userName, userAge, imageUrl });
    user.save();

    // res.status(201).send({ user });
    res.status(200).send({
      msg:"회원가입이 완료 되었습니다."
    })
  } catch (error) {
    res.status(400).send({
      errormassage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

router.post("/login", async (req, res) => {
 try {
    console.log( req.body );
    const { userEmail, password } = req.body;
    const user = await User.findOne({ userEmail });
    const re_userEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const re_password = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

    console.log("id확인");
    if (userEmail.search(re_userEmail) == -1) {
      res.status(400).send({
        errormassage: "이메일 형식이 아닙니다.",
      });
      return;
    }

    console.log("pw확인");
    if (password.search(re_password) == -1) {
      res.status(400).send({
        errormassage: "8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 입력해야 합니다",
      });
      return;
    }

    console.log("id, pw일치확인");
    const isValid = await compare(password, user.userPassword);
    if (!isValid) {
      res.status(400).send({
        errormassage: "아이디나 비밀번호를 다시 확인해 주세요",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId, imageUrl: process.env.IMAGE_IP + user.imageUrl }, 
                          process.env.SECRET_KEY, { expiresIn: "6h" });

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
      user: { userId: user.userId },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errormassage: "사용자 정보를 가져오지 못하였습니다.",
    });
  }
});

// 나의 상세정보 조회 
router.get("/personal", authMiddlewares, async (req, res) => {
  try {
    const { user } = res.locals;
    res.status(200).send({
      user: { 
        userName: user.userName,
        userEmail: user.userEmail,
        userIntro: user.userIntro,
        category: user.category,
        imageUrl: process.env.IMAGE_IP + user.imageUrl,
        workPlace: user.workPlace        
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errormassage: "상세 정보를 가져오지 못하였습니다.",
    });
  }
});

const deleteImage = (imgName) => {
  const exist = fs.existsSync("./static/" + imgName);

  console.log("파일 존재: ", exist);  

  if (exist) {
    fs.unlink("./static/" + imgName, (err) => {
      if (err) {
        console.log("파일삭제 실패: ", err);
      }
    });
  }
}

// 상세 정보 수정 
router.put("/modify", authMiddlewares, upload.single("imageUrl"), async (req, res) => {
  try {
    var { user } = res.locals;
    var { userIntro, category, workPlace } = req.body;
  } catch {
    return res.status(400).send({
      errorMessage: "개인정보를 불러올 수 없습니다."
    });
  }

  const old_imgUrl = user.imageUrl;
  const decode_category = JSON.parse(category);

  if (userIntro) user.userIntro = userIntro;
  if (workPlace) user.workPlace = workPlace;
  if (req.file.filename) user.imageUrl = req.file.filename;
  if (decode_category.length) {
    user.category = []; //배열 초기화
    decode_category.forEach((el)=> user.category.push(el));
  }

  try{
    user.save();
  } catch {
    deleteImage(req.file.filename);
    return res.status(400).send({
      errorMessage: "정보 변경에 실패했습니다."
    });
  }

  deleteImage(old_imgUrl);

  res.status(200).send({
    msg: "수정 되었습니다."
  });
});

module.exports = router;