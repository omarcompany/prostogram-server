const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const cards = require("./routes/cards");
const HTTP_RESPONSE = require("./constants/errors");
const auth = require("./middlewares/auth");
const authRouter = require("./routes/auth");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/prostogramdb", (error) => {
  if (error) throw error.message;

  console.log(`Connected to prostogram server`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use(auth);
app.use("/users", users);
app.use("/cards", cards);
app.use((err, req, res, next) => {
  const { statusCode = HTTP_RESPONSE.internalError, message } = err;

  res.status(err.statusCode).send({
    message:
      statusCode === HTTP_RESPONSE.internalError
        ? HTTP_RESPONSE.internalError.message
        : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
