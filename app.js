const express = require("express");
const mongoose = requure("mongoose");

const { PORT = 3000 } = process.env;

const app = express();

const URI = "mongodb://localhost:27017/prostogramdb";

mongoose.connect(
  URI,
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
  (error) => {
    if (error) throw error.message;

    console.log(`Connected to ${URI}`);
  }
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
