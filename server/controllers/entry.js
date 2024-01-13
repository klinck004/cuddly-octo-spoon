var express = require('express');
let Entry = require('../models/entry');
console.log("BP entry controller loaded!"); /* for dev peace of mind */

const d = new Date();
function time12(dateTime) {
    date = dateTime.substring(0, dateTime.indexOf("T"));
    inputTime = dateTime.substring(dateTime.indexOf("T") + 1);
    hour = inputTime.substring(0, inputTime.indexOf(":"));
    min = inputTime.substring(inputTime.indexOf(":") + 1);
    let AmPm = hour >= 12 ? 'pm' : 'am';
    hour = (hour % 12) || 12;
    finalTime = (hour +":"+ min + AmPm);
    return [date, finalTime, AmPm]
}

function calculateAverage(array) {
    var total = 0;
    var count = 0;

    array.forEach(function(item, index) {
        total += item;
        count++;
    });

    return total / count;
}

function bpRating(sys, dia) {
    if (sys >= 140 || dia >= 90) {
        return "High"
    } else if (sys >= 130 || dia > 80) {
        return "Medium"
    } else if (sys > 120 && dia < 80) {
        return "Elevated"
    } else if (sys <= 120 && dia <= 80) {
        return "Normal"
    } else {
        return "Unavailable"
    }
}

// Overview of data
module.exports.DisplayOverview = async (req, res, next) => {
    try {
        let day = d.getDate();
        let month = d.getMonth() + 1;
        if (day < 10) {
            day = '0' + day;
        }
        
        if (month < 10) {
            month = `0${month}`;
        }
        let year = d.getFullYear();
        let current = year + "-" + month + "-" + day;
        console.log(current);
        const EntryList = await Entry.find({"date": current }).sort({datetime: "desc"}); // Sort by time -- latest first
        let sysEntries = [];
        let diaEntries = [];
        for(let count=0;count<EntryList.length;count++) {
            sysEntries.push(EntryList[count].sys);
            diaEntries.push(EntryList[count].dia);
        }
        let avgBP = [Math.round(calculateAverage(sysEntries)), Math.round(calculateAverage(diaEntries))]
        
        // Render page
        res.render('bp/overview', {
            title: 'Blood Pressure Overview for ' + req.user.displayName,
            EntryList: EntryList,
            avgBP: avgBP,
            displayName: req.user ? req.user.displayName : '',
            avgRating: bpRating(avgBP[0], avgBP[1]),
            sysEntries: sysEntries,
            diaEntries: diaEntries
        })
    } catch (err) {
        console.error(err);
        //Handle error
        res.render('bp/overview', {
            error: 'Error on server'
        });
        
    }
};

// Read list
module.exports.DisplayEntries = async (req, res, next) => {
    try {
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const EntryList = await Entry.find({ datetime: { $gte: startOfMonth, $lt: endOfMonth } }).sort({date: "desc"}).exec();
        // const EntryList = await Entry.find().sort({date: "desc"}); // Sort by date
        res.render('bp/list', {
            title: 'Blood Pressure Entries for ' + req.user.displayName,
            EntryList: EntryList,
            displayName: req.user ? req.user.displayName : ''
        });
    } catch (err) {
        console.error(err);
        //Handle error
        err.status = 500;
        next(err)
    }
};

// Add new entry
module.exports.AddEntry = async (req, res, next) => {
    try {
        res.render('bp/add',
            {
                title: 'Add new entry',
                displayName: req.user ? req.user.displayName : ''
            })
    }
    catch (err) {
        console.error(err);
        res.render('bp/list',
            {
                error: 'Error adding entry'
            });
    }
};

// Process new entry
module.exports.ProcessAddEntry = async (req, res, next) => {
    dateTime = time12(req.body.date)
    date = dateTime[0]
    time = dateTime[1]
    ampm = dateTime[2]
    rating = bpRating(req.body.sys, req.body.dia)

    let newEntry = Entry({
        "datetime": req.body.date,
        "date": date,
        "time": time,
        "sys": req.body.sys,
        "dia": req.body.dia,
        "pulse": req.body.pulse,
        "rating": rating,
        "leftArm": req.body.leftArm,
        "rightArm": req.body.rightArm,
        "notes": req.body.notes
    });
    console.log(newEntry);
    Entry.create(newEntry)
        .then(() => {
            res.redirect('/bp');
        })
        .catch((err) => {
            console.log("LOG: Add POST error:");
            console.log(err)
            res.render('error', {
                error: 'Add POST error:'
            });
        });
};


// Edit existing entry
module.exports.EditEntry = async (req, res, next) => {
    try {
        const id = req.params.id;
        const entryToEdit = await Entry.findById(id);
        res.render('bp/edit',
            {
                title: 'Edit existing entry',
                entry: entryToEdit,
                displayName: req.user ? req.user.displayName : ''
            })
    }
    catch (error) {
        console.error(err);
        res.render('bp/list',
            {
                error: 'Error editing entry'
            });
    }
}
// Process existing entry
module.exports.ProcessEditEntry = (req, res, next) => {
    try {
        const id = req.params.id;
        let editObj = {"_id": id,};
        if (req.body.sys != "") {
            editObj.sys = req.body.sys
        }
        if (req.body.dia != "") {
            editObj.dia = req.body.dia
        }
        if (req.body.pulse != "") {
            editObj.pulse = req.body.pulse
        }
        if (req.body.notes != "") {
            editObj.notes = req.body.notes
        }
        Entry.findByIdAndUpdate(id, editObj).then(() => {
            res.redirect('/bp')
        });
    }
    catch (err) {
        console.error(err);
        res.render('bp/list',
            {
                error: 'Error on the server'
            });
    }
}

// View more info entry
module.exports.ViewEntry = async (req, res, next) => {
    try {
        const id = req.params.id;
        const entryToView = await Entry.findById(id);
        res.render('bp/view',
            {
                title: 'View entry',
                entry: entryToView,
                displayName: req.user ? req.user.displayName : ''
            })
    }
    catch (error) {
        console.error(err);
        res.render('bp/list',
            {
                error: 'Error editing entry'
            });
    }
}

// Delete entry
module.exports.DeleteEntry = (req, res, next) => {
    try {
        let id = req.params.id;
        Entry.deleteOne({ _id: id }).then(() => {
            res.redirect('/bp')
        })
    }
    catch (error) {
        console.error(err);
        res.render('bp/list',
            {
                error: 'Error deleting entry'
            });
    }
}

