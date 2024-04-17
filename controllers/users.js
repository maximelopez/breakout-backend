require("../models/connection");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

exports.signup = (req, res) => {
  if (req.body.firstname && req.body.email && req.body.password) {
    // Vérifier si l'utilisateur existe déjà
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        res.json({ result: false, error: "User already exists" });
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          firstname: req.body.firstname,
          email: req.body.email,
          password: hash,
          token: uid2(32),
          avatar: "",
          favoriteCategories: [],
          likedEvents: [],
        });

        newUser.save().then((user) => {
          res.json({
            result: true,
            token: user.token,
            email: user.email,
            firstname: user.firstname,
          });
        });
      }
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
};

exports.signin = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        // L'utilisateur existe, vérification du password
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Utilisateur connecté
          res.json({
            result: true,
            token: user.token,
            email: user.email,
            firstname: user.firstname,
          });
        } else {
          res.json({
            result: false,
            error: "User not found or wrong password",
          });
        }
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
};

//Trial delete account//
exports.remove = (req, res) => {
  //Authentification ?//
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        // Verifie password
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Suppression si password correspond
          User.deleteOne({ _id: user._id })
            .then(() => {
              res.json({
                result: true,
                message: "Account deleted successfully",
              });
            })
            .catch((error) => {
              res.json({ result: false, error: "Error deleting account" });
            });
        } else {
          // Sinon, retourne erreur
          res.json({ result: false, error: "Incorrect password" });
        }
      }
    });
  }
};
