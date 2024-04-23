const express = require("express");
const router = express.Router();

const eventsCtrl = require("../controllers/events");

// Créer un event
router.post("/", eventsCtrl.postEvent);

// Récupérer tous les events
router.get("/all/:token", eventsCtrl.getAllEvents);

// Récupérer un event
router.get("/details/:token/:id", eventsCtrl.getEvent);

// Supprimer un event
router.delete("/:token/:id", eventsCtrl.deleteEvent);

// Modifier un event
router.put("/:token/:id", eventsCtrl.updateEvent);

// Inscrire un user à un event
router.put("/register/:token/:id", eventsCtrl.registerEvent);

// Désinscrire un user d'un event
router.put("/unregister/:token/:id", eventsCtrl.unregisterEvent);

// Récupérer tous les events où un user est inscrit
router.get("/register/:token", eventsCtrl.getMyEvents);

// Récupérer tous les events crées par un user
router.get("/created/:token", eventsCtrl.getMyEventsCreated);

module.exports = router;
