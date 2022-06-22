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

  try{
    const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);

    console.log( userId );

     User.findById(userId)
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
        if (!user) {
          res.status(400).send({
            errorMessage: "회원가입이 필요합니다",
          });
        }
      });
  } catch {
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능합니다.",
    });  
  }
};
