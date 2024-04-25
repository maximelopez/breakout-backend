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

router.get("/all/:token", async (req, res) => {
  await User.findOne({ token: req.params.token }).then((user) => {
    // rajout await le 24/04 à12h38
    if (user) {
      Gpsevent.find().then((events) => {
        res.json({ result: true, gpsevents: events });
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.delete("/:token/:id", (req, res) => {
  // Vérification du token utilisateur
  User.findOne({ token: req.params.token }).then((user) => {
    if (user) {
      // Suppression de l'event
      Gpsevent.deleteOne({ _id: req.params.id }).then(() => {
        res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.put("/register/:token/:id", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    if (user) {
      Gpsevent.findById(req.params.id).then((event) => {
        if (event) {
          // Vérifier si l'utilisateur est déjà inscrit : à faire plus tard
          if (event.participants.includes(user._id)) {
            // L'utilisateur est déjà inscrit
            res.json({
              result: false,
              error: "Utilisateur déjà inscrit à cet event.",
            });
          } else {
            // L'utilisateur n'est pas encore inscrit, inscription à l'event
            Gpsevent.updateOne(
              { _id: req.params.id },
              { $push: { participants: user._id } }
            ).then(() => {
              res.json({ result: true });
            });
          }
        } else {
          res.json({ result: false, error: "Event not found" });
        }
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.put("/unregister/:token/:id", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    if (user) {
      Gpsevent.findById(req.params.id).then((event) => {
        if (event) {
          // Vérifier si l'utilisateur est inscrit à l'event
          if (event.participants.includes(user._id)) {
            // L'utilisateur est inscrit, on le désinscrit
            Gpsevent.updateOne(
              { _id: req.params.id },
              { $pull: { participants: user._id } }
            ).then(() => {
              res.json({ result: true });
            });
          } else {
            // L'utilisateur n'est pas inscrit
            res.json({
              result: false,
              error: "Utilisateur n'est pas inscrit à cet event.",
            });
          }
        } else {
          res.json({ result: false, error: "Event not found" });
        }
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.get("/details/:token/:id", (req, res) => {
  // Vérification du token utilisateur
  User.findOne({ token: req.params.token }).then((user) => {
    if (user) {
      Gpsevent.findById(req.params.id)
        .populate("creator", ["firstname", "email", "avatar"]) // pas indispensable ? si pour supprimer un évént
        .then((event) => {
          res.json({ result: true, event: event });
        });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
