var express = require("express");
var router = express.Router();

require("../models/connection");
const Event = require("../models/events");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", (req, res) => {
  let title = req.body.title;
  let date = req.body.selectedDate;
  let address = req.body.place;
  let category = req.body.category;
  let description = req.body.description;
  let numberOfSeats = req.body.seats;
  // let eventCreator = ??;

  const newEvent = new Event({
    title,
    date,
    address,
    category,
    description,
    numberOfSeats,
  });
  newEvent.save().then(() => {
    res.json({ result: true });
  });
});

module.exports = router;
