const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

const URI = "mongodb://localhost:27017/prostogramdb";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", users);

mongoose.connect(URI, (error) => {
  if (error) throw error.message;

  console.log(`Connected to ${URI}`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
