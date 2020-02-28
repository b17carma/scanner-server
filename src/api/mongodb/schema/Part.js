const mongoose = require('mongoose');

let partSchema = mongoose.Schema({
    equipment: {type: mongoose.Schema.Types.ObjectId, ref: 'Equipment'},
    identifier: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    lastScan: {type: mongoose.Schema.Types.ObjectId}
});

const Part = mongoose.model("Part", partSchema, "parts");

module.exports = Part;