require("express-async-errors");
const express = require("express");
const app = express();

//allowing cross origin access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin:*");
  req.header("Access-Control-Allow-Headers:*",);
  req.header("Access-Control-Allow-Haeders:x-auth-token")
  req.header("Access-Control-Allow-Headers: Accept")
  next();
});

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
module.exports = server;
