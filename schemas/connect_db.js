const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
<<<<<<< HEAD
  mongoose.connect(process.env.MONGO_URL, { ignoreUndefined: true }).catch((err) => console.error("db 연결이 되지 않았습니다."));
=======
  mongoose
  .connect(process.env.MONGO_URL, { ignoreUndefined: true })
  .catch(err => console.error("db 연결이 되지 않았습니다."));
>>>>>>> 07b8c35035867dbb68a3707bfaaa19f7d525fc97
};

module.exports = connect;
