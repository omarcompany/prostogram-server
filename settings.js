const path = require("path");
const config = require("config");

const { STATIC_DIR_NAME } = config;

const STATIC_PATH = path.join(__dirname, STATIC_DIR_NAME);

module.exports = { STATIC_PATH };
