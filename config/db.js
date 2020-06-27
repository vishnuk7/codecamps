const mongoos = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  const conn = await mongoos.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(chalk`{yellow MongoDB Connected ${conn.connection.host} }`);
};

module.exports = connectDB;
