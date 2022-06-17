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





//더미 데이터 넣기
router.post("/add", async (req, res) => {
  
  let name = "김형근"



  for( let i = 0; i < 30; i++){

    setname = `${name}_${i}`;


  }



  res.status(200).send({
    msg: "성공"  
  });
});

module.exports = router;