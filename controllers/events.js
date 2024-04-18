const Event = require("../models/events");
const User = require("../models/users");
const Category = require("../models/categories");


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


exports.deleteEvent = (req, res) => {
    // Vérification du token utilisateur
    User.findOne({ token: req.params.token }).then(user => {
      if (user) {
        // Suppression de l'event
        Event.deleteOne({ _id: req.params.id }).then(() => {
            res.json({ result: true });
        })
  
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    })
};


exports.updateEvent = (req, res) => {
    // Vérification du token utilisateur
    User.findOne({ token: req.params.token }).then(user => {
        if (user) {

            Event.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id}).then(() => {
                res.json({ result: true });
            })

        } else {
            res.json({ result: false, error: 'User not found' });
        }
    })
};



exports.registerEvent = (req, res) => {
    User.findOne({ token: req.params.token }).then(user => {
      if (user) {

        Event.findById(req.params.id).then(event => {
          if (event) {
            // Vérifier si l'utilisateur est déjà inscrit
            if (event.participants.includes(user._id)) {
              // L'utilisateur est déjà inscrit
              res.json({ result: false, error: 'Utilisateur déjà inscrit à cet event.' });
            } else {
              // L'utilisateur n'est pas encore inscrit, inscription à l'event
              Event.updateOne({ _id: req.params.id }, { $push: { participants: user._id } }).then(() => {
                res.json({ result: true });
              });
            }

          } else {
            res.json({ result: false, error: 'Event not found' });
          }
        })

      } else {
        res.json({ result: false, error: 'User not found' });
      }
    })
};

exports.unregisterEvent = (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user) {

      Event.findById(req.params.id).then(event => {
        if (event) {
          // Vérifier si l'utilisateur est inscrit à l'event
          if (event.participants.includes(user._id)) {
            // L'utilisateur est inscrit, on le désinscrit
            Event.updateOne({ _id: req.params.id }, { $pull: { participants: user._id } }).then(() => {
              res.json({ result: true });
            })
          } else {
            // L'utilisateur n'est pas inscrit
            res.json({ result: false, error: 'Utilisateur n\'est pas inscrit à cet event.' });
          }

        } else {
            res.json({ result: false, error: 'Event not found' });
        }
      })

    } else {
      res.json({ result: false, error: 'User not found' });
    }
  })
};


exports.getMyEvents = (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user) {

      Event.find({ participants: { $in: [user._id] } })
        .populate('creator', ['firstname', 'email', 'avatar'])
        .populate('category', ['name', 'description'])
        .then(events => {
          if (events[0]) {
            res.json({ result: true, events: events });
          } else {
            res.json({ result: false, error: 'Events not found' });
          }
        });

    } else {
        res.json({ result: false, error: 'User not found' });
    }
  })
};


exports.getMyEventsCreated = (req, res) => {
  console.log('hello')
  User.findOne({ token: req.params.token }).then(user => {
    if (user) {

      Event.find({ creator: user._id })
        .populate('creator', ['firstname', 'email', 'avatar'])
        .populate('category', ['name', 'description'])
        .then(events => {
          if (events[0]) {
            res.json({ result: true, events: events });
          } else {
            res.json({ result: false, error: 'Events not found' });
          }
        });

    } else {
      res.json({ result: false, error: 'User not found' });
    }
  })
}