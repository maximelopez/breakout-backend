const express = require("express");
const router = express.Router();

const usersCtrl = require("../controllers/users");

router.post("/signup", usersCtrl.signup);
router.post("/signin", usersCtrl.signin);
router.delete("/remove/:token", usersCtrl.remove);
router.put("/modify/:token", usersCtrl.modify);
router.get("/print/:token", usersCtrl.print);

router.put("/like/:token/:eventId", usersCtrl.likeEvent);
router.get("/like/:token", usersCtrl.loadEvent);

module.exports = router;
