const mongoose = require("mongoose");
module.exports = URI => {
  mongoose.connect(URI,
    {
      useNewUrlParser: true,
      //useFindAndModify: false,
      useUnifiedTopology: true
    }
  );
  const connection = mongoose.connection;
  connection.once("open", () => {
		console.log("MongoDB connection established successfully");
  });
};