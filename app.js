const express = require("express");
const connect_MongoDB = require("./schemas/connect_db");
<<<<<<< HEAD
const cors = require("cors");
const usersRouter = require("./routes/users.js");
const chatsRouter = require("./routes/chats.js");
const recommendsRouter = require("./routes/recommends.js");
=======
const usersRouter = require("./routes/users.js");
const chatsRouter = require("./routes/chats.js");
const recommendsRouter = require("./routes/recommends.js");
const cors = require('cors');

>>>>>>> 07b8c35035867dbb68a3707bfaaa19f7d525fc97
const app = express();
const port = 3000;
require("dotenv").config();

<<<<<<< HEAD
// console.log(process.env.MONGO_DB);

=======
>>>>>>> 07b8c35035867dbb68a3707bfaaa19f7d525fc97
connect_MongoDB(); //DB 연결

app.use(
  cors({
    exposedHeaders: ["authorization"],
    origin: "*", //출처 허용 옵션: 테스트용 - 전부허용!
    credentials: "true", // 사용자 인증이 필요한 리소스(쿠키..등) 접근
  })
);

app.use(express.static("static")); // 사진 저장소
app.use(express.json()); // json형태의 데이터를 parsing하여 사용할 수 있게 만듦.
<<<<<<< HEAD
app.use(express.urlencoded({ extended: false }));
app.use("/users", [usersRouter]);
app.use("/chats", [chatsRouter]);
app.use("/recommends", [recommendsRouter]);
=======
app.use(express.urlencoded({extended:false}));
app.use("/api/users", [usersRouter]);
app.use("/api/chats", [chatsRouter]);
app.use("/api/recommends", [recommendsRouter]);
>>>>>>> 07b8c35035867dbb68a3707bfaaa19f7d525fc97

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌습니다.");
});
