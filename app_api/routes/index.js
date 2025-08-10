const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// LIST: GET /api/trips
router.get('/trips', tripsController.tripsList);

// DETAIL: GET /api/trips/:tripCode
router.get('/trips/:tripCode', tripsController.tripsFindByCode);

router.post('/trips', tripsController.tripsAddTrip);

router.put('/trips/:tripCode', tripsController.tripsUpdateTrip);

module.exports = router;