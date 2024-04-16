const express = require("express");
const router = express.Router();

const eventsCtrl = require('../controllers/events');

router.post("/", eventsCtrl.postEvent);
router.get('/all/:token', eventsCtrl.getAllEvents);
router.get('/:token/:id', eventsCtrl.getEvent);
router.delete('/:token/:id', eventsCtrl.deleteEvent);
router.put('/:token/:id', eventsCtrl.updateEvent);

module.exports = router;
