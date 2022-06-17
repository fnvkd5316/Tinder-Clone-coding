const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const Chat = require("../schemas/chat.js");

//미들웨어 구현되면 넣기

router.get("/", async (req, res) => {
  const myId = "김형근_1"; //미들웨어 Id 넣음

  const me = await User.findOne({ userId: myId });

  if (!me) {
    return  res.status(400).send({
      errorMessage: "내 정보를 찾을 수 없습니다."
    });
  }

  // if (me.likeMe.length >= 2) {
  //   //이용해서 두명
  // } else if ( me.likeMe.length === 1 ) {

  // } else {

  // }
  console.log(1);

  const users = User.aggregate({$sample:{size: 2}});

  console.log(2);


  res.status(200).send({
    result: "success",
    users
  });
});


router.post("/select", async (req, res) => {
  const myId = "test1"; //미들웨어 Id 넣음
  const { selectId, select } = req.body;

  const me = await User.findOne({ userId: myId });
  const other = await User.findOne({userId: selectId});

  if ( !me || !other ) {
    return  res.status(400).send({
      errorMessage: "정보를 찾을 수 없습니다."
    });
  }

  if (select === true) {
    me.like.push(selectId);
    other.likeMe.push(myId);

    //chat 서버에 추가한다.

  } else {

  }

  me.likeMe.find(selectId);




  me.save();
  other.save();


  res.status(200).send({
    result: "success",
  });
});




//더미 데이터 넣기
router.post("/add", async (req, res) => {

  const {name} = req.body;

  for ( let i = 1; i < 31; i++ ) {
    console.log(i);
    const user = new User({ 
        userId: `${name}_${i}`, 
        password: "1234qwer",
        userName: `${name}_${i}`,
        userAge: i,
        imageUrl: "https://i.ytimg.com/vi/ZV_zXb_P22g/maxresdefault.jpg",
        like:[],
        likeMe:[],
        bad:[],
        badMe:[]
      });
    user.save();
  }

  res.status(200).send({
    msg: "성공"  
  });
});

module.exports = router;