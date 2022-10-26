const router = require("express").Router();
const {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
