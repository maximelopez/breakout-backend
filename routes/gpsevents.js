const Gpsevent = require("../models/gpsevents");
const User = require("../models/users");
const express = require("express");
const router = express.Router();

// créer un nouvel "événement GPS"
router.post("/", (req, res) => {
  if (
    req.body.date &&
    req.body.description &&
    req.body.latitude &&
    req.body.longitude &&
    req.body.seats
  ) {
    // voir quelles conditions il faut ci-dessus
    const newGpsevent = new Gpsevent({
      date: req.body.date,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      seats: req.body.seats,
    });

    newGpsevent.save().then((newGpsevent) => {
      res.json({ result: true, gpsevent: newGpsevent });
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
});

router.get("/all/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    if (user) {
      Gpsevent.find().then((events) => {
        res.json({ result: true, gpsevents: events });
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

// recherche d'un événement'
// router.get("/:category", (req, res) => {
//   let category = req.params.category;
//   Category.findOne({ _id: category }).then((category) => {
//     if (category) {
//       //   let name = data.name;
//       //   let name = data.name;
//       //   let description = data.description;
//       // affichage catégorie sous forme de name et description
//       //   res.json({ result: true, name, description });
//       let name = category.name;
//       res.json({ result: true, name });
//     } else {
//       res.json({ result: false, error: "Catégorie non trouvée" });
//     }
//   });
// });

module.exports = router;
