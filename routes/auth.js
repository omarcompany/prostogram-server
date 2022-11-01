const router = require("express").Router();

const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

module.exports = router;
