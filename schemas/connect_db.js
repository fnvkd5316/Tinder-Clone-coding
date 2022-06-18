const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
<<<<<<< HEAD
  mongoose.connect("mongodb://127.0.0.1:27017/Tinder_Clone", { ignoreUndefined: true }).catch((err) => console.error("db 연결이 되지 않았습니다."));
=======
  mongoose
  .connect(process.env.MONGO_URL, { ignoreUndefined: true })
  .catch(err => console.error("db 연결이 되지 않았습니다."));      
>>>>>>> 62395b61cca9d00864ed90f8d8151bd85f97ce5a
};

module.exports = connect;
