const mongoose = require("mongoose");
const config = require("config");

// can create winston logs here as well
// and get rid of catch sentence
module.exports = function () {
  mongoose
    .connect(config.get("db"),{
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => console.log(`connected to ${config.get("db")} `))
    .catch((e) => console.log("unable to connect to database", e));
};
