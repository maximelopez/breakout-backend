const express = require("express");
const router = express.Router();

const Event = require("../models/events");
const User = require("../models/users");
const Category = require("../models/categories");

router.post("/", (req, res) => {
  // Vérification des champs
  if (req.body.token && req.body.category && req.body.title && req.body.adress && req.body.description && req.body.numberOfSeat) {

    // Récupérer les id du user et de la catégorie
    User.findOne({ token: req.body.token }).then(userData => {
      if (userData) {
        console.log(userData.token, userData._id);
        const creator = userData._id;

        Category.findOne({ name: req.body.category }).then(categoryData => {
          if (categoryData) {
            console.log(categoryData.name, categoryData._id);
            const category = categoryData._id;

            // Création de l'event
            const newEvent = new Event({
              title: req.body.title,
              creator: creator,
              date: req.body.date,
              adresse: req.body.adress,
              category: category,
              description: req.body.description,
              numberOfSeat: req.body.numberOfSeat,
              participants: [],
            });

            newEvent.save().then((event) => {
              res.json({ result: true, event: event });
            });

          } else {
            res.json({ result: false, error: 'Category not found'});
          }
      })

      } else {
        res.json({ result: false, error: 'User not found'});
      }

    })
  } else {
    res.json({ result: false, error: 'Missing or empty fields' });
  }
});

// Récupérer tous les events
router.get('/all/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user) {

      Event.find()
        .populate('creator', ['firstname', 'email', 'avatar'])
        .populate('category', ['name', 'description'])
        .then(events => {
          res.json({ result: true, events: events });
        });

    } else {
      res.json({ result: false, error: 'User not found' });
    };
  });
});

// Récupérer un event (pour la page détails)
router.get('/:token/:id', (req, res) => {
  // Vérification du token utilisateur
  User.findOne({ token: req.params.token }).then(user => {
    if (user) {

      Event.findById(req.params.id )
      .populate('creator', ['firstname', 'email', 'avatar'])
      .populate('category', ['name', 'description'])
      .then(event => {
        res.json({ result: true, event: event });
      });

    } else {
      res.json({ result: false, error: 'User not found' });
    }
  })
});



module.exports = router;
