var express = require('express');
var router = express.Router();

let entryController = require('../controllers/entry.js');
// User authentication check
function requireAuth(req, res, next) {
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}

// Read Operation
router.get('/', requireAuth, entryController.DisplayOverview);
router.get('/list', requireAuth, entryController.DisplayEntries);
router.get('/view/:id', requireAuth, entryController.ViewEntry);
/* Get route for Add Entry page --> Create */
router.get('/add', requireAuth, entryController.AddEntry); 
/* Post route for Add Entry page --> Create */
router.post('/add', requireAuth, entryController.ProcessAddEntry);
/* Get route for displaying the Edit Entry page --> Update */
router.get('/edit/:id', requireAuth, entryController.EditEntry);
/* Post route for processing the Edit Entry page --> Update */
router.post('/edit/:id', requireAuth, entryController.ProcessEditEntry);
/* Get to perform Delete Operation --> Delete Operation */
router.get('/delete/:id', requireAuth, entryController.DeleteEntry);
module.exports = router;