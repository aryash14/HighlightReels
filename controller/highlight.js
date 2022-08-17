// Highlight Controller for our MVC designe pattern
var express = require('express');
var router = express.Router();
const Sport = require('../models/sport')
const Team = require('../models/team')
const Highlight = require('../models/highlights')
const mongoose = require("mongoose");

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

router.post('/filter', async function (req, res) {
    let sports = req.body.sports;
    let teams = req.body.teams;

    let hasNoFootBall = true, hasNoBasketBall = true, hasNoBaseball = true;
    let allFootBallTeam = getStrSportName((await Sport.find({name: 'Football'}).populate('team'))[0].team);
    let allBasketBallTeam = getStrSportName((await Sport.find({name: 'Basketball'}).populate('team'))[0].team);
    let allBaseballTeam = getStrSportName((await Sport.find({name: 'Baseball'}).populate('team'))[0].team);

    for (let x of teams) {
        if (allFootBallTeam.indexOf(x) >= 0) {
            hasNoFootBall = false;
        }
        if (allBasketBallTeam.indexOf(x) >= 0) {
            hasNoBasketBall = false;
        }
        if (allBaseballTeam.indexOf(x) >= 0) {
            hasNoBaseball = false;
        }
    }
    console.log(hasNoBasketBall);
    console.log(sports)
    if (hasNoFootBall && sports.indexOf('62e2c2c49bf026bd163b9b4b') >= 0) {
        teams = teams.concat(allFootBallTeam)
    }
    if (hasNoBasketBall && sports.indexOf('62e2c2c59bf026bd163b9b57') >= 0) {
        teams = teams.concat(allBasketBallTeam)
    }
    if (hasNoBaseball && sports.indexOf('62e2c2c59bf026bd163b9b63') >= 0) {
        teams = teams.concat(allBaseballTeam)
    }

    let allHighlight = await Highlight.find({}).populate('sport').populate('team');

    let filtered = [];

    for (let x of allHighlight) {
        for (let y of teams) {
            if (x.team.name === y) {
                filtered.push(x);
                break;
            }
        }
    }

    res.json(filtered);
});

function getStrSportName(j) {
    let str = [];
    for (let x of j) {
        str.push(x.name);
    }
    return str;
}
module.exports = router;

