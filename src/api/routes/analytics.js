const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();

let Equipment = require("../mongodb/schema/Equipment");
let Part = require("../mongodb/schema/Part");
let Scan = require("../mongodb/schema/Scan");

router.get('/stats', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let successCount = 0;
    let failureCount = 0;

    Scan.find().lean().exec(function (err, scans) {
        scans.map(function (scan) {
            if (scan.status)
                successCount++;
            else
                failureCount++;
        });

        return res.send(JSON.stringify({
            totalScans: scans.length,
            successCount: successCount,
            failureCount: failureCount
        }));
    });
});

router.get('/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        return res.send(JSON.stringify(scans));
    });
});

router.get('/scans/:equipmentId/:startDate/:endDate', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let startDate = moment(req.params.startDate);
    let endDate = moment(req.params.endDate);

    let filter = {
        equipmentId: req.params.equipmentId,
        time: {
            $gte: moment(req.params.startDate).toDate(),
            $lte: moment(req.params.endDate).toDate()
        },
        status: false
    };

    let weeks = [];

    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'weeks')) {
        let formattedWeek = m.day('Monday').format("DD/MM/YY");

        weeks.push({
            x: formattedWeek,
            y: 0
        })
    }

    Scan.find(filter).sort({time: 'ascending'}).lean().exec(function (err, scans) {
        scans.map(function (scan) {
            let formattedWeek = moment(scan.time).day('Monday').format("DD/MM/YY");

            let week = weeks.find(week => week.x === formattedWeek);
            week.y = week.y + 1;
        });

        let chartData = {
            id: 'Faults',
            data: weeks
        };

        return res.send(JSON.stringify(chartData));
    });
});

router.get('/calendar', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        let days = [];

        scans.map(function (scan) {
            let formattedDay = moment(scan.time).format('YYYY-MM-DD').toString();

            if (days.filter(e => e.day === formattedDay).length > 0) {
                let day = days.find(x => x.day === formattedDay);
                day.value = day.value + 1;
            } else {
                days.push({
                    day: formattedDay,
                    value: 1
                })
            }
        });
        return res.send(JSON.stringify(days));
    });
});


module.exports = router;