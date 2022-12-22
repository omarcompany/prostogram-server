const path = require("path");
const config = require("config");

const { ROOT_STATIC_DIR } = config;

const AVATAR_DIR = path.join(ROOT_STATIC_DIR, "avatar");
const CARD_DIR = path.join(ROOT_STATIC_DIR, "card");

const AVATAR_STATIC_PATH = path.join(__dirname, AVATAR_DIR);
const CARD_STATIC_PATH = path.join(__dirname, CARD_DIR);

module.exports = {
  AVATAR_DIR,
  CARD_DIR,
  AVATAR_STATIC_PATH,
  CARD_STATIC_PATH,
};
