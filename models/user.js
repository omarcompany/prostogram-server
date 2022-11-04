const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const { HTTP_RESPONSE } = require("../constants/errors");
const NotFoundError = require("../errors/not-found-error");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLengthL: 30,
    default: "John Doe",
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
    select: false,
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

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user)
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user)
          );
        }
        return user;
      });
    });
};
module.exports = mongoose.model("user", userSchema);
