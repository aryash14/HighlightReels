var express = require('express');
var router = express.Router();
const Sport = require('../models/sport')
const Team = require('../models/team')
const Highlight = require('../models/highlights')
const mongoose = require("mongoose");

// get all the sport and team
router.get('/', async function(req, res, next) {
    let result = await Highlight.find({}).populate('sport').populate('team');
    res.json(result);
});

router.post('/likedislike', async function (req, res) {
    if (req.body.like) {
        let new_like = req.body.like;
        let id = req.body.id; 
        console.log("id", id);
        await Highlight.findOneAndUpdate({_id: id}, {like: new_like})
    }

    if (req.body.dislike) {
        let new_like = req.body.dislike;
        let id = req.body.id; 
        await Highlight.findOneAndUpdate({_id: id}, {dislike: new_like})
    }


})

router.post('/upload', async function (req, res) {

    if (! req.body.title || req.body.title === '' || !req.body.desc || req.body.desc === '' ||
        !req.body.youtube_id || req.body.youtube_id === '' || !req.body.sport || !req.body.team) {

        console.log(req.body);
        res.json({'msg': 'Some fields are not completed. ', 'success': false});
        return;
    }
    let youtubeURLArray = req.body.youtube_id.split('v=')

    if (youtubeURLArray.length === 1) {
        res.json({'msg': 'Youtube URL format error.', 'success': false});
        return;
    }

    let yid = youtubeURLArray[1]
    let ampersandPosition = yid.indexOf('&');
    if(ampersandPosition !== -1) {
        yid = yid.substring(0, ampersandPosition);
    }

    let searched_team = await Team.find({name: req.body.team})

    if (searched_team.length === 0) {
        res.json({'msg': 'Team name is not valid, select one team name. ', 'success': false});
        return;
    }

    let tid = (searched_team[0])._id;
    const doc = new Highlight({
        title: req.body.title,
        desc: req.body.desc,
        youtube_id: yid,
        like: 0,
        dislike: 0,
        sport: mongoose.Types.ObjectId(req.body.sport),
        team: mongoose.Types.ObjectId(tid)
    })

    let result = await doc.save();
    res.json({'_id': result._id, 'msg': 'Upload Success', 'success': true});
});

module.exports = router;

