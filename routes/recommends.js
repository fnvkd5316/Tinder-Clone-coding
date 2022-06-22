const express = require("express");
const router = express.Router();
const {User, SelectSchema} = require("../schemas/user.js");
// const Chat = require("../schemas/chat.js");
const authMiddlewares = require("../middlewares/authconfirm.js");
const mongoose = require("mongoose");
require("dotenv").config();

const recommend_Random = (array, num, ban) => {

  // 집계 파이프라인에서는 auto casting이 일어나지 않으므로 캐스팅필요
  array = array.map((element) => {
    return mongoose.Types.ObjectId(element);
  });

  // $nin : 배열내 요소를 제외하고 검색
  // $in  : 배열내 요소를 검색
  let searchQuery = ban ? { $nin: array } : { $in: array };
  
  const user =  User.aggregate([
    {$match:  { _id: searchQuery }}, 
    {$sample: { size: num  }}, // 랜덤으로 뽑아올 개수 
    {$project:{ // 안가져오는 항목
                userEmail: false,
                userPassword: false, like:  false, 
                likeMe: false,   bad:   false, 
                badMe: false,    __v:   false 
              }
    }
  ]);

  const empty_array = [];

  if ( user.length === 0 ) {
    return empty_array;
  }

  return user;
};


router.get("/", authMiddlewares, async (req, res) => {
  try{
    var me = res.locals.user;
    var ban_array = [/*...me.like, ...me.bad, ...me.badMe, me.userId*/]; //검색 안되야할 목록
  } catch {
    return res.status(400).send({
      errorMessage: "로그인 해주세요."
    });
  }

  let likeMeUser = [];
  let randomUser = [];

  if (me.likeMe.length > 1) {
    likeMeUser = await recommend_Random(me.likeMe, 2, false); 
  } else if ( me.likeMe.length === 1 ) {
    ban_array.push(me.likeMe[0]);//위에서 1명 뽑아왔으므로!
    randomUser = await recommend_Random(ban_array, 1, true );  //검색조건 다르다.
    likeMeUser = await recommend_Random(me.likeMe, 1, false);
  } else {
    randomUser = await recommend_Random(ban_array, 2, true );
  }

  const users = [...likeMeUser, ...randomUser]; 

  if (users.length === 0) {
    return res.status(401).send({
      errorMessage: "검색된 유저가 없습니다."
    });
  } 

  res.status(200).send({ 
      users: users.map( user => {
        try{
          user.imageUrl = process.env.IMAGE_IP + user.imageUrl;
        } catch {
          return user;
        }
        return user;
      })
  });

});


router.post("/select", authMiddlewares, async (req, res) => {

  try {
    var { selectId, select } = await SelectSchema.validateAsync(req.body);
  } catch {
    return res.status(400).send({
      errorMessage: "받아올 정보를 찾을 수 없습니다."
    });
  }

  const me = res.locals.user;
  const other = await User.findById( selectId );

  if ( !me || !other ) {
    return  res.status(401).send({
      errorMessage: "받아올 정보를 찾을 수 없습니다."
    });
  }

  const me_info = me.userId;
  const other_info = other.userId;

  if (select === true) { // 좋아요
    me.like.push(other_info);
    other.likeMe.push(me_info);
  } else { // 싫어요
    me.bad.push(other_info);
    other.badMe.push(me_info);
  }

  // if (me.likeMe.includes(other_info) && select === true) {
  // 해당기능 승완님 요청으로 우선 봉인
    // const chat = await new Chat({ userId_A: me_info, userId_B: other_info }); //chat 서버에 추가한다.
    // chat.save();
  // }

  const likeMe_not_in_like = me.likeMe.filter(userId => me.like.includes(userId) === false );

  if ( likeMe_not_in_like.length ) {
    var users = await recommend_Random(likeMe_not_in_like, 1, false);
  } else {
    const ban_array = [/*...me.like, ...me.bad, ...me.badMe*/]; //검색 안되야할 목록
    ban_array.push(me_info);
    var users = await recommend_Random(ban_array, 1, true);
  }

  me.save();
  other.save();

  if (users.length === 0) {
    return res.status(401).send({
      errorMessage: "검색된 유저가 없습니다."
    });
  } else {

  console.log(users.map( user => {
    user.imageUrl = process.env.IMAGE_IP + user.imageUrl;
    return user;
  }));

  return res.status(200).send({ 
    users: users.map( user => {
      try {
        user.imageUrl = process.env.IMAGE_IP + user.imageUrl;
      } catch {
        return user;          
      }
      return user;
    })
  });    
}

});


//더미 데이터 넣기 - 테스트용
const { hash, compare, compareSync } = require("bcryptjs");

router.post("/add", async (req, res) => {

  const {name} = req.body;
  const userPassword = await hash("1234_qwer", 10);

  for ( let i = 1; i < 31; i++ ) {
  
    const user = new User({ 
        userEmail: `${name}_${i}@email.com`, 
        userPassword: userPassword,
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
    msg: "테스트용 더미넣기 성공"  
  });
});


router.get("/delete_select:select", async (req, res) => {

  const setBoolean = req.params;

  
  if ( setBoolean ) await User.updateMany({}, { $set:{ like:[], likeMe:[] }});
  else await User.updateMany({}, { $set:{ bad:[], badMe:[] }});

  res.status(200).send({
    msg:"성공"
  })
});

module.exports = router;