const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// highlight Schema for MongoDB
let highlightSchema = new Schema(
    {
        title: {type: String, required: true},
        desc: {type: String, required: false},
        youtube_id: {type: String, required: true},
        like: {type: Number, required: true},
        dislike: {type: Number, required: true},
        sport: {type: Schema.Types.ObjectId, ref: 'Sport', required: true},
        team: {type: Schema.Types.ObjectId, ref: 'Team', required: true}
    }
)

module.exports = mongoose.model('Highlight', highlightSchema)