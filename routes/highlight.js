var express = require('express');
var router = express.Router();
const Sport = require('../models/sport')
const Team = require('../models/team')
const Highlight = require('../models/highlights')

// get all the sport and team
router.get('/', async function(req, res, next) {
    let result = await Highlight.find({}).populate('sport').populate('team');
    res.json(result);
});

// router.post('/upload', async function (req, res) {
//
// })
module.exports = router;

