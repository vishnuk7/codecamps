const mongoos = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  const conn = await mongoos.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log(chalk`{yellow MongoDB Connected ${conn.connection.host} }`);
};
