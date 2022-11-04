const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("config");

const user = require("./routes/user");
const users = require("./routes/users");
const cards = require("./routes/cards");
const auth = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const commonError = require("./middlewares/common-error");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(config.DBHost, (error) => {
  if (error) throw error.message;

  console.log(`Connected to prostogram server`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", authRouter);
if (config.util.getEnv("NODE_ENV") !== "test") {
  app.use(morgan("combined"));
}
app.use(auth);
app.use("/user", user);
app.use("/users", users);
app.use("/cards", cards);
app.use(commonError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
