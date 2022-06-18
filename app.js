const express = require("express");
const connect_MongoDB = require("./schemas/connect_db");
<<<<<<< HEAD
const cors = require("cors");
=======
const usersRouter = require("./routes/users.js");
const chatsRouter = require("./routes/chats.js");
const recommendsRouter = require("./routes/recommends.js");
const cors = require('cors');
>>>>>>> 62395b61cca9d00864ed90f8d8151bd85f97ce5a
const app = express();
const port = 3000;
require("dotenv").config();

<<<<<<< HEAD
console.log(process.env.MONGO_DB);

=======
>>>>>>> 62395b61cca9d00864ed90f8d8151bd85f97ce5a
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
=======
app.use(express.urlencoded({extended:false}));
app.use("/users", [usersRouter]);
app.use("/chats", [chatsRouter]);
app.use("/recommends", [recommendsRouter]);

>>>>>>> 62395b61cca9d00864ed90f8d8151bd85f97ce5a

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌습니다.");
});
