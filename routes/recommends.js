const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const Chat = require("../schemas/chat.js");
const authMiddlewares = require("../middlewares/authconfirm.js");

const recommend_Random = (array, num, ban) => {
  
  // $nin : 배열내 요소를 제외하고 검색
  // $in  : 배열내 요소를 검색
  let query = ban ? { $nin: array } : { $in: array };
  
  const user =  User.aggregate([
    {$match: { userEmail: query }}, 
    {$sample: { size: num }}, // 랜덤으로 뽑아올 개수 
    {$project: { // 안가져오는 항목
                  userEmail: false,
                  userPassword: false, like:  false, 
                  likeMe: false,   bad:   false, 
                  badMe: false,    __v:   false 
               }
    }
  ]);

  return user;
};


router.get("/", authMiddlewares, async (req, res) => {
  try{
    var me = res.locals.user;
    var ban_array = [...me.like, ...me.bad, ...me.badMe, me.userId]; //검색 안되야할 목록
  } catch {
    return res.status(400).send({
      errorMessage: "로그인 해주세요."
    });
  }

  let users = [];

  if (me.likeMe.length > 1) {   

    // likeMe >  1:  2명을 뽑아서 올린다.
    users = await recommend_Random(me.likeMe, 2, false);

  } else if ( me.likeMe.length === 1 ) {

    // likeME == 1: 1명 올리고, 1명은 랜덤 // like, likeMe, badMe 제외
    users.push( await User.findbyId(me.likeMe) );

    ban_array.push(me.likeMe);
    users.push( await recommend_Random(ban_array, 1, true) );

  } else {
    // likeMe == 0: 2명 랜덤 // like , likeMe, badMe 제외
    users = await recommend_Random(ban_array, 2, true);
  }

  if (users.length === 0) {
    return res.status(401).send({
      errorMessage: "검색된 유저가 없습니다."
    });
  }

  res.status(200).send({ users });
});


router.post("/select", authMiddlewares, async (req, res) => {

  try{
    var { selectId, select } = req.body;
  } catch {
    return res.status(400).send({
      errorMessage: "받아올 정보를 찾을 수 없습니다."
    });
  }

  const me = res.locals.user;
  const other = await User.findById( selectId ); 
  const me_info = me.userEmail;
  const other_info = other.userEmail;

  if ( !me || !other ) {
    return  res.status(401).send({
      errorMessage: "받아올 정보를 찾을 수 없습니다."
    });
  }

  if (select === true) { // 좋아요
    me.like.push(other_info);
    other.likeMe.push(me_info);

    // if (me.likeMe.includes(other_info)){
    // 해당기능 승완님 요청으로 우선 봉인
    // const chat = await new Chat({ userId_A: me_info, userId_B: other_info }); //chat 서버에 추가한다.
    // chat.save();
    // }
  } else { // 싫어요
    me.bad.push(other_info);
    other.badMe.push(me_info);
  }

  if ( me.likeMe.length ) {
    var users = await recommend_Random(me.likeMe, 1, false);
  } else {
    const ban_array = [...me.like, ...me.bad, ...me.badMe]; //검색 안되야할 목록
    ban_array.push(me_info);
    var users = await recommend_Random(ban_array, 1, true);
  }

  me.save();
  other.save();

  res.status(200).send({ users });
});


//더미 데이터 넣기 - 테스트용
const { hash, compare } = require("bcryptjs");

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
    msg: "성공"  
  });
});

module.exports = router;