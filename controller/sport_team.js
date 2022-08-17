var express = require('express');
var router = express.Router();
const Sport = require('../models/sport')
const Team = require('../models/team')

// get all the sport and team
router.get('/', async function(req, res, next) {
    let result = await Sport.find({}).populate('team');
    res.json(result);
});

module.exports = router;

