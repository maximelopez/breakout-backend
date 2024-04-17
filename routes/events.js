const express = require("express");
const router = express.Router();

const eventsCtrl = require('../controllers/events');

// Créer un event
router.post("/", eventsCtrl.postEvent);

// Récupérer tous les events
router.get('/all/:token', eventsCtrl.getAllEvents);

// Récupérer un event
router.get('/:token/:id', eventsCtrl.getEvent);

// Supprimer un event
router.delete('/:token/:id', eventsCtrl.deleteEvent);

// Modifider un event
router.put('/:token/:id', eventsCtrl.updateEvent);

// Inscrire un user à un event
router.put('/signup/:token/:id', eventsCtrl.signupEvent);

// Récupérer tous les events où un user est inscrit
router.get('/:token', eventsCtrl.getMyEvents);

module.exports = router;
