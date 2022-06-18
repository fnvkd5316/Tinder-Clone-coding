const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const Chat = require("../schemas/chat.js");
const authMiddlewares = require("../middlewares/authconfirm.js");

const recommend_Random = (array, num, ban) => {
  // $nin : 배열을 요소를 제외하고 검색
  // $in  : 배열을 요소를 검색
  let query = ban ? { $nin: array } : { $in: array };
  
  const user =  User.aggregate([
    {$match: { userId: query }}, 
    {$sample: { size: num }}, // 랜덤으로 검색할 개수 
    {$project: { //표기 안함
          _id:   false,    userEmail: false,
          password: false, like:  false, 
          likeMe: false,   bad:   false, 
          badMe: false,    __v:   false }}
  ]);

  return user;
};

//미들웨어 구현되면 넣기
router.get("/", authMiddlewares, async (req, res) => {

  const me = res.locals.user;
  let users = [];
  const ban_array = [...me.like, ...me.bad, ...me.badMe, me.userId]; //검색 안되야할 목록

  if (me.likeMe.length > 1) {   

    // likeMe >  1:  2명을 뽑아서 올린다.
    users = await recommend_Random(me.likeMe, 2, false);

  } else if ( me.likeMe.length === 1 ) {

    // likeME == 1: 1명 올리고, 1명은 랜덤 // like, likeMe, badMe 제외
    ban_array.push(me.likeMe);
    users.push( await recommend_Random(ban_array, 1, true) );
    users.push( await User.findbyId(me.likeMe) );

  } else {
    // likeMe == 0: 2명 랜덤 // like , likeMe, badMe 제외
    users = await recommend_Random(ban_array, 2, true);
  }

  if ( users.length === 0) {
    return res.status(401).send({
      errorMessage: "검색된 유저가 없습니다."
    });
  }

  res.status(200).send({ users });
});


router.post("/select", authMiddlewares, async (req, res) => {

  const me = res.locals.user;
  const { selectId, select } = req.body;

  // 좋아요, 싫어요 받은 대상
  const other = await User.findById( selectId ); 

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
  
    const user = new User({ 
        userEmail: `${name}_${i}@email.com`, 
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