const express = require("express");
const router = express.Router();

const usersCtrl = require("../controllers/users");

router.post("/signup", usersCtrl.signup);
router.post("/signin", usersCtrl.signin);
router.delete("/remove", usersCtrl.remove);

module.exports = router;
