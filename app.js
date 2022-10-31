const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const cards = require("./routes/cards");
const HTTP_RESPONSE = require("./constants/errors");

const { PORT = 3000 } = process.env;

const app = express();

const URI = "mongodb://localhost:27017/prostogramdb";

/* We don't have relations between card and user, so add temporary hack */
app.use((req, res, next) => {
  req.user = {
    _id: "6356a2c46f54bfcbe8073b29",
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

mongoose.connect(URI, (error) => {
  if (error) throw error.message;

  console.log(`Connected to ${URI}`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
