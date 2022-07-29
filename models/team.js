const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Team schema for MongoDB
let TeamSchema = new Schema(
    {
        name: {type: String, required: true},
    }
)

module.exports = mongoose.model('Team', TeamSchema)
