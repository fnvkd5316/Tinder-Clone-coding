const jwt = require("jsonwebtoken");
const {User} = require("../schemas/user");
require("dotenv").config();

module.exports = (req, res, next) => {

  try{
    var { authorization } = req.headers;
    var [tokenType, tokenValue] = (authorization || "").split(" ");
  } catch {
    return res.status(400).send({
      errorMessage: "로그인 후 이용 가능합니다.",
    });
  }
  console.log("인증키: ", authorization );
  console.log("타입: ", tokenType );
  console.log("토큰 값: ", tokenValue );

  if (!tokenValue || tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능합니다.",
    });
    return;
  }

  try {
  //  // 만료된 토큰 재갱신 및 확인
  //   const token = jwt.verify(tokenValue, process.env.SECRET_KEY);
  //   console.log(token);
  //   if (token == "jwt expired") {
  //     // token 만료시 복호화하여 userInfo에 값을 할당 후
  //     const { userId } = jwt.decode(tokenValue, process.env.SECRET_KEY);
  //     let refresh_token;
  //     User.findById(userId)
  //       .exec()
  //       .then((user) => {
  //         refresh_token = user.refresh_token;
  //         const Refresh_token = jwt.verify(refresh_token, process.env.SECRET_KEY);
  //         if (Refresh_token == "jwt expired") {
  //           // refreshToken도 만료 되면 에러 메세지
  //           return res.status(400).send({ errorMessage: "로그인이 필요합니다." });
  //         } else {
  //           // refreshToken이 만료되지 않으면 토큰 재발급
  //           const newToken = jwt.sign({ userName: user.userName, imageUrl: user.imageUrl }, process.env.SECRET_KEY, { expiresIn: "30m" });
  //           console.log(newToken);
  //           return res.status(201).send({ newToken });
  //         }
  //       });
  //   } else {
      const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
      User.findById( userId )
        .exec()
        .then((user) => {
          console.log("로그인된 유저", user);
          res.locals.user = user;
          next();
          if (!user) {
            res.status(400).send({ errorMessage: "회원가입이 필요합니다" });
          }
        });
    // }
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능합니다.",
    });  
  }
};
