const router = require("express").Router();
const {
  updateAvatar,
  updateUser,
  getCurrentUser,
} = require("../controllers/users");

router.patch("/me/", updateUser);
router.get("/me/", getCurrentUser);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
