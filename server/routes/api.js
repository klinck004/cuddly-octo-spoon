const express = require('express')
const router = express.Router();
let Entry = require('../models/entry');

// Get entries
router.get('/entries', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    try {
        const d = new Date();
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const EntryList = await Entry.find({ datetime: { $gte: startOfMonth, $lt: endOfMonth } }).sort({ date: "desc" }).exec();
        res.json(EntryList)
    } catch (err) {
        console.error(err);
        //Handle error
        err.status = 500;
        next(err)
    }
});

// Add new entry
router.post('/add', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    console.log(req.body)
    /*
    let newEntry = Entry({
        "datetime": req.body.date,
        "date": 0,
        "time": 0,
        "sys": req.body.sys,
        "dia": req.body.dia,
        "pulse": req.body.pulse,
        "rating": 0,
        "leftArm": req.body.leftArm,
        "rightArm": req.body.rightArm,
        "notes": req.body.notes
    });
    console.log(newEntry);
    Entry.create(newEntry)
        .then(() => {
            console.log("Okay!")
        })
        .catch((err) => {
            console.log("LOG: Add POST error:");
            console.log(err)
            res.render('error', {
                error: 'Add POST error:'
            });
        });
    */
})

module.exports = router;