const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLengthL: 30,
    default: 'John Doe'
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  about: {
    type: String,
    minLength: 2,
    maxLengthL: 30,
    default: "Inventor",
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return isEmail(value);
      },
      message: "Invalid email",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
