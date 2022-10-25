const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const cards = require('./routes/cards')

const { PORT = 3000 } = process.env;

const app = express();

const URI = "mongodb://localhost:27017/prostogramdb";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", users);

/* We don't have relations between card and user, so add temporary hack */
app.use((req, res, next) => {
  req.user = {
    _id: "6356a2c46f54bfcbe8073b29",
  };
  next();
});

app.use('/cards', cards)

mongoose.connect(URI, (error) => {
  if (error) throw error.message;

  console.log(`Connected to ${URI}`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
