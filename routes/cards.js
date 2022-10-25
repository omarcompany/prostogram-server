const router = require("express").Router();
const { createCard, getCards, remove } = require("../controllers/cards");

router.post("/", createCard);
router.get("/", getCards);
router.delete("/:id", remove);

module.exports = router;
