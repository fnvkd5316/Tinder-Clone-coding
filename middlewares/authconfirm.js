const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
require("dotenv").config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = (authorization || "").split(" ");
<<<<<<< HEAD
=======

>>>>>>> 3616ab37948a66964c067e46ec92c191663edba2
  if (!tokenValue || tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능합니다.",
    });
    return;
  }

  try {
<<<<<<< HEAD
    // 만료된 토큰 재갱신 및 확인
    const token = jwt.verify(tokenValue, process.env.SECRET_KEY);
    if (token == "jwt expired") {
      // 토큰 만료시 복화하여 userInfo에 값을 할당 후
      const userInfo = jwt.decode(tokenValue, process.env.SECRET_KEY);
      console.log(userInfo);
      const userEmail = userInfo.userEmail;
      let refresh_token;
      User.findOne({ where: userEmail })
        .exec()
        .then((user) => {
          refresh_token = user.refresh_token;
          const RefreshToken = verify(refresh_token, process.env.SECRET_KEY);
          if (RefreshToken == "jwt expired") {
            // refreshToken도 만료 되면 에러 메세지
            res.status(201).send({ errorMessage: "로그인이 필요합니다." });
          } else {
            // refreshToken이 만료되지 않으면 재 새 토큰 재발급
            const newToken = jwt.sign({ userName: user.userName, imageUrl: user.imageUrl }, process.env.SECRET_KEY, { expiresIn: "30m" });
            res.status(201).send({ errorMessage: " 재발급 ", newToken });
          }
        });
    } else {
      const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
      User.findOne({ userId })
        .exec()
        .then((user) => {
          res.locals.user = user;
          next();
          if (!user) {
            res.status(400).send({ errorMessage: "회원가입이 필요합니다" });
          }
        });
    }
=======
    const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
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
>>>>>>> 3616ab37948a66964c067e46ec92c191663edba2
  } catch (err) {
    console.log(err);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능합니다.",
    });
  }
};
