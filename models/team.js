// Model for our MVC designe pattern to declare the schema for teams
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Team schema for MongoDB
let TeamSchema = new Schema(
    {
        name: {type: String, required: true},
    }
)

module.exports = mongoose.model('Team', TeamSchema)
