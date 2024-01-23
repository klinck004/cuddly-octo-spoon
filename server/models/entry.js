let mongoose = require('mongoose');

// create schema model for blood pressure entry
let entryModel = new mongoose.Schema({
    datetime: Date,
    date: String,
    time: String,
    sys: Number,
    dia: Number,
    pulse: Number,
    rating: String,
    leftArm: String,
    notes: String
},
    {
        collection:"bp"
    });
module.exports = mongoose.model('entry', entryModel);