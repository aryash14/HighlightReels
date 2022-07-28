const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SportSchema = new Schema(
    {
        name: {type: String, required: true},
        team: [{type: Schema.Types.ObjectId, ref: 'Team'}]
    }
)

module.exports = mongoose.model('Sport', SportSchema)
