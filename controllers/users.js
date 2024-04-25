require("../models/connection");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const Category = require("../models/categories");

//Uniqid//
const uniqid = require("uniqid");
//Cloudinary//
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.signup = (req, res) => {
  if (req.body.firstname && req.body.email && req.body.password) {
    // Vérifier si l'utilisateur existe déjà
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        res.json({ result: false, error: "L'utilisateur existe déjà." });
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          firstname: req.body.firstname,
          email: req.body.email,
          password: hash,
          token: uid2(32),
          avatar: "",
          dateOfBirth: "",
          favoriteCategories: [],
          likedEvents: [],
        });

        newUser.save().then((user) => {
          res.json({
            result: true,
            token: user.token,
            id: user._id,
            email: user.email,
            firstname: user.firstname,
          });
        });
      }
    });
  } else {
    res.json({ result: false, error: "Champs manquants ou vides." });
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
            id: user._id,
            email: user.email,
            firstname: user.firstname,
          });
        } else {
          res.json({
            result: false,
            error: "Utilisateur introuvable ou mot de passe incorrect.",
          });
        }
      } else {
        res.json({
          result: false,
          error: "Utilisateur introuvable ou mot de passe incorrect.",
        });
      }
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
};

// Liker un event
exports.likeEvent = (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user) {

      if (user.likedEvents.includes(req.params.eventId)) {
        User.updateOne({ token: req.params.token  }, { $pull: { likedEvents: req.params.eventId } }).then(() => {
          res.json({ result: true, message: 'Event supprimé de la liste des likes.' })
        })
      } else {
        User.updateOne({ token: req.params.token  }, { $push: { likedEvents: req.params.eventId } }).then(() => {
          res.json({ result: true, message: 'Event ajouté à la liste des likes.' });
        })
      }

    } else {
      res.json({ result: false, error: 'User not found' });
    }
  })
};

// Récupérer les likes d'un user
exports.loadEvent = (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (user) {
      res.json({ result: true, eventsLiked: user.likedEvents });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  })
}


// //Trial delete account//
// exports.remove = (req, res) => {
//   //Authentification ?//
//   if (req.body.email && req.body.password) {
//     User.findOne({ email: req.body.email }).then((user) => {
//       if (user) {
//         // Verifie password
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//           // Suppression si password correspond
//           User.deleteOne({ _id: user._id })
//             .then(() => {
//               res.json({
//                 result: true,
//                 message: "Account deleted successfully",
//               });
//             })
//             .catch((error) => {
//               res.json({ result: false, error: "Error deleting account" });
//             });
//         } else {
//           // Sinon, retourne erreur
//           res.json({ result: false, error: "Incorrect password" });
//         }
//       }
//     });
//   }
// };

// Supprimer un compte
exports.remove = (req, res) => {
  // Vérification du token utilisateur
  User.findOne({
    token: req.params.token,
  })
    .then((user) => {
      if (user) {
        // Suppression du compte
        User.deleteOne({ _id: user._id })
          .then((result) => {
            if (result.deletedCount > 0) {
              res.json({ result: true, message: "Utilisateur supprimé" });
            } else {
              res.json({ result: false, error: "La suppression a échoué" });
            }
          })
          .catch((err) => {
            res.json({
              result: false,
              error: "Une erreur est survenue lors de la suppression",
            });
          });
      } else {
        res.json({ result: false, error: "Utilisateur non trouvé" });
      }
    })
    .catch((err) => {
      res.json({
        result: false,
        error: "Une erreur est survenue lors de la recherche de l'utilisateur",
      });
    });
};

exports.modify = (req, res) => {
  // checking user token
  User.findOne({
    token: req.params.token,
  }).then((user) => {
    if (user) {
      // updating user data
      // Récupérer l'id de la catégorie pour la clé étrangère
      Category.findOne({ name: req.body.category }).then((categoryData) => {
        if (categoryData) {
          let category = categoryData._id;
          //
          User.updateOne(
            { token: user.token },
            {
              $set: {
                dateOfBirth: req.body.dateOfBirth,
                favoriteCategories: category,
              },
              $currentDate: { lastModified: true }, // ligne sert ?
            }
          ).then((user) => {
            console.log(user);
            res.json({
              result: true,
              // avatar: user.avatar,
              // favoriteCategories: user.favoriteCategories,
              // dateOfBirth: user.dateOfBirth,
            });
          });
        } else {
          res.json({ result: false, error: "Category not found" });
        }
      });
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
};

exports.print = (req, res) => {
  // checking user token
  User.findOne({
    token: req.params.token,
  }).then((user) => {
    if (user) {
      let avatar = user.avatar;
      let favoriteCategories = user.favoriteCategories;
      let dateOfBirth = user.dateOfBirth;
      let email = user.email;
      // reading user data
      res.json({
        result: true,
        avatar,
        favoriteCategories,
        dateOfBirth,
        email,
      });
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
};

//Ajouter photo au profil et l'envoyer vers cloudinary//
exports.addPicture = async (req, res) => {
  try {
    const files = req.files;
    console.log("Files", files);

    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await files.avatar.mv(photoPath);
    // console.log("PhotoPath", photoPath);
    // console.log("ResultMove", resultMove);

    if (!resultMove) {
      const resultCloudinary = await cloudinary.uploader.upload(photoPath);
      // console.log("resultCloudinary", resultCloudinary);

      // Mettre à jour url photo dans BDD, verification token utilisateur//
      const updatedUser = await User.findOneAndUpdate(
        { token: req.params.token },
        { avatar: resultCloudinary.secure_url },
        { new: true }
      );

      if (!updatedUser) {
        console.error("Erreur lors de la mise à jour de la photo de profil");
        return res
          .status(500)
          .send("Erreur lors de la mise à jour de la photo de profil");
      }

      // Supprimer le fichier temporaire
      fs.unlinkSync(photoPath);

      // Renvoyer la réponse avec l'URL de la photo
      return res.json({ result: true, photoUrl: resultCloudinary.secure_url });
    } else {
      // Si le déplacement du fichier a échoué, renvoyer une réponse avec une erreur
      return res.json({ result: false, error: resultMove });
    }
  } catch (err) {
    // console.error("Erreur:", err);
    return res.status(500).send("Erreur de serveur");
  }
};
