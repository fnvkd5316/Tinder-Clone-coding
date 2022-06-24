const express = require("express");
const router = express.Router();
const {User, SelectSchema} = require("../schemas/user.js");
const authMiddlewares = require("../middlewares/authconfirm.js");
const mongoose = require("mongoose");
require("dotenv").config();

const recommend_Random = (array, num, ban) => {

  // $nin : 배열내 요소를 제외하고 검색
  // $in  : 배열내 요소를 검색
  let searchQuery = ban ? { $nin: array } : { $in: array };

  const user =  User.aggregate([
    {$match:  { userEmail: searchQuery }}, // _id로 바꿀경우 위에 주석도 풀어야함.
    {$sample: { size: num  }}, // 랜덤으로 뽑아올 개수 
    {$project:{ // 안가져오는 항목
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
  try {
    var me = res.locals.user;
    var ban_array = [...me.like, ...me.bad, ...me.badMe, me.userEmail]; //검색 안되야할 목록
  } catch {
    return res.status(400).send({
      errorMessage: "로그인 해주세요.",
    });
  }

  let likeMeUser = [];
  let randomUser = [];

  let likeMe_filter = me.likeMe.filter( userEmail => me.like.includes(userEmail) === false );
  likeMe_filter = likeMe_filter.filter( userEmail => me.bad.includes(userEmail) === false );

  if (likeMe_filter.length > 1) {

    likeMeUser = await recommend_Random(likeMe_filter, 2, false); 
  } else if ( likeMe_filter.length === 1 ) {

    ban_array.push(me.likeMe[0]);//위에서 1명 뽑아왔으므로!
    randomUser = await recommend_Random(ban_array, 1, true);  //검색조건 다르다.
    likeMeUser = await recommend_Random(likeMe_filter, 1, false);
  } else {

    randomUser = await recommend_Random(ban_array, 2, true);
  }

  const users = [...likeMeUser, ...randomUser]; 

  if (users.length === 0) {

    const setUser = {
      _id: "404",
      userAge: "404",
      userName: "없어요",
      imageUrl: process.env.IMAGE_IP + "userEmpty.png",
      userIntro: "추천할 유저가 없습니다",
      category: [],
      workPlace: "공허하네요"        
    }

    const set = [];
    set.push(setUser); //배열로 넣어서 보낸다.

    return res.status(200).send({
      users: set,
    });
  }

  me.recommends = [];

  users.forEach( (el) => {
    me.recommends.push(el.userEmail);
  });

  me.save();

  res.status(200).send({ 
      users: users.map( user => {
        const set = {
          _id: user._id,
          userAge: user.userAge,
          userName: user.userName,
          imageUrl: process.env.IMAGE_IP + user.imageUrl,
          userIntro: user.userIntro,
          category: user.category,
          workPlace: user.workPlace
        }
        return set;
      })
  });

});

router.post("/select", authMiddlewares, async (req, res) => {
  try {
    var { selectId, select } = await SelectSchema.validateAsync(req.body);
  } catch {
    return res.status(400).send({
      errorMessage: "받아올 정보를 찾을 수 없습니다.",
    });
  }

  const me = res.locals.user;
  const other = await User.findById( selectId );

  if (!me || !other) {
    return res.status(401).send({
      errorMessage: "받아올 정보를 찾을 수 없습니다.",
    });
  }

  if (me.like.includes(other.userEmail) && select === true) {
    return res.status(402).send({
      errorMessage: "이미 좋아요를 누른 유저입니다.",
    });
  }

  if (me.bad.includes(other.userEmail) && select === false) {
    return res.status(402).send({
      errorMessage: "이미 싫어요를 누른 유저입니다.",
    });
  }

  me.recommends = me.recommends.filter(userEmail => userEmail !== other.userEmail);

  const me_info = me.userEmail;
  const other_info = other.userEmail;

  if (select === true) { // 좋아요
    me.like.push(other_info);
    other.likeMe.push(me_info);
  } else { // 싫어요
    me.bad.push(other_info);
    other.badMe.push(me_info);
  }

  let likeMe_filter = me.likeMe.filter(userEmail => me.like.includes(userEmail) === false );
  likeMe_filter = likeMe_filter.filter(userEmail => me.bad.includes(userEmail) === false );

  if ( likeMe_filter.length ) {
    var users = await recommend_Random(likeMe_filter, 1, false);
  } else {
    let ban_array = [...me.like, ...me.bad, ...me.badMe, ...me.recommends]; //검색 안되야할 목록

    ban_array.push(me_info);
    var users = await recommend_Random(ban_array, 1, true);
  }

  users.forEach( (el) => {
    me.recommends.push(el.userEmail);
  });

  me.save();
  other.save();

  if (users.length === 0) {
    const setUser = {
      _id: "404",
      userAge: "404",
      userName: "없어요",
      imageUrl: process.env.IMAGE_IP + "userEmpty.png",
      userIntro: "추천할 유저가 없습니다",
      category: [],
      workPlace: "공허하네요"        
    }

    const set = [];
    set.push(setUser); //배열로 넣어서 보낸다.

    return res.status(200).send({
      users: set,
    });
  } else {
    res.status(200).send({ 
        users: users.map( user => {
          const set = {
            _id: user._id,
            userAge: user.userAge,
            userName: user.userName,
            imageUrl: process.env.IMAGE_IP + user.imageUrl,
            userIntro: user.userIntro,
            category: user.category,
            workPlace: user.workPlace
          }
          return set;
        })
    });
  }

});

module.exports = router;

