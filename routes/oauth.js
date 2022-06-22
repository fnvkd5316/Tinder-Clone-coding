const express = require("express");
const router = express.Router();
const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const Sns = require("../schemas/sns");

passport.use(
  "kakao",
  new kakaoStrategy(
    {
      // 카카오 로그인에서 발급받은 REST API 키
      clientID: process.env.KAKAO_ID,
      // 카카오 로그인 Redirect URI 경로
      callbackURL: "/api/oauth/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const existuser = await Sns.findOne({
          where: { snsId: profile.id, provider: "kakao" },
        });
        if (existuser) {
          done(null, existuser);
        } else {
          const newUser = await Sns.create({
            snsId: profile.id,
            nick: profile.displayName,
            image: profile.image,
            email: profile._json && profile._json.kaccount_email,
            provider: "kakao",
          });
          done(null, newUser);
        }
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

router.get("/", passport.authenticate("kakao"));

router.get("/callback", passport.authenticate("kakao", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/");
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  //? 두번 inner 조인해서 나를 팔로우하는 followerid와 내가 팔로우 하는 followingid를 가져와 테이블을 붙인다
  User.findOne({ where: { id } })
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

module.exports = router;
