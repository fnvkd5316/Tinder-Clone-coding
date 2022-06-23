// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const kakaoStrategy = require("passport-kakao").Strategy;
// const Sns = require("../schemas/sns");

// passport.use(
//   "kakao",
//   new kakaoStrategy(
//     {
//       // 카카오 로그인에서 발급받은 REST API 키
//       clientID: process.env.KAKAO_ID,
//       // 카카오 로그인 Redirect URI 경로
//       callbackURL: "/api/oauth/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log(accessToken);
//         console.log(refreshToken);
//         console.log(profile);
//         const existuser = await Sns.findOne({
//           where: { snsId: profile.id, provider: "kakao" },
//         });
//         if (existuser) {
//           done(null, existuser);
//         } else {
//           const newUser = await Sns.create({
//             snsId: profile.id,
//             nick: profile.displayName,
//             image: profile.image,
//             email: profile._json && profile._json.kaccount_email,
//             provider: "kakao",
//           });
//           done(null, newUser);
//         }
//       } catch (error) {
//         console.log(error);
//         done(error);
//       }
//     }
//   )
// );

// router.get("/", passport.authenticate("kakao"));

// router.get("/callback", passport.authenticate("kakao", { failureRedirect: "/login" }), (req, res) => {
//   res.redirect("/");
// });

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// module.exports = router;
