const bodyParser = require("body-parser");
const config = require("config");
const { errors } = require("celebrate");
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const mongoose = require("mongoose");
const morgan = require("morgan");

const auth = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const cards = require("./routes/cards");
const commonError = require("./middlewares/common-error");
const { cors } = require("./middlewares/cors");
const { rolesInstance } = require("./controllers/roles");
const user = require("./routes/user");
const users = require("./routes/users");

const { PORT = 3000, DBHost, STATIC_DIR_NAME } = config;

const initStaticPath = () => {
  if (!fs.existsSync(STATIC_DIR_NAME)) {
    fs.mkdirSync(STATIC_DIR_NAME);
  }
};

const app = express();

mongoose.connect(DBHost, (error) => {
  if (error) throw error.message;

  console.log(`Connected to prostogram server ${DBHost}`);
});

initStaticPath();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);
app.use(fileUpload({}));
app.use(express.static(STATIC_DIR_NAME));

app.use("/", authRouter);
if (config.util.getEnv("NODE_ENV") !== "test") {
  app.use(morgan("combined"));
}

app.use(auth);
app.use("/user", user);
app.use("/users", users);
app.use("/cards", cards);
app.use(errors());
app.use(commonError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

rolesInstance();

module.exports = app;
