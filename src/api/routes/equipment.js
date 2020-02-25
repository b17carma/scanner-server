const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = express.Router();
var equipmentSchema = require("../mongodb/schema/EquipmentSchema");

let EquipmentModel = mongoose.model("Equipment", equipmentSchema, "equipment");

router.get('/', cors(), function (req, res) {
    mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.find().lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

router.get('/:equipmentId', cors(), function (req, res) {
    mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.findOne({_id: req.params.equipmentId}).lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

module.exports = router;