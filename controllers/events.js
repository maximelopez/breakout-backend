const Event = require("../models/events");
const User = require("../models/users");
const Category = require("../models/categories");

// Créer un event
exports.postEvent = (req, res) => {
    // Vérification des champs
    if (req.body.token && req.body.category && req.body.title && req.body.selectedDate && req.body.address && req.body.description && req.body.seats) {
        // Récupérer l'id du user pour la clé étrangère
        User.findOne({ token: req.body.token }).then(userData => {
        if (userData) {
            const creator = userData._id;
            // Récupérer l'id de la catégorie pour la clé étrangère
            Category.findOne({ name: req.body.category }).then(categoryData => {
            if (categoryData) {
                const category = categoryData._id;
                // Création de l'event
                const newEvent = new Event({
                title: req.body.title,
                creator: creator,
                date: req.body.selectedDate,
                address: req.body.address,
                category: category,
                description: req.body.description,
                seats: req.body.seats,
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
};

// Récupérer tous les events
exports.getAllEvents = (req, res) => {
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
};

// Récupérer un event
exports.getEvent = (req, res) => {
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
};

// Supprimer un event
exports.deleteEvent = (req, res) => {
    // Vérification du token utilisateur
    User.findOne({ token: req.params.token }).then(user => {
      if (user) {
  
        Event.findById(req.params.id)
  
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    })
};

// Modifier un event
exports.updateEvent = (req, res) => {

};
