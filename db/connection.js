const mongoose = require("mongoose");

const connectMongo = async () => {
  return mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  });
};

module.exports = {
  connectMongo,
};
