let express = require('express');
let router = express.Router();
let indexController = require("../controllers/index.js")

function inDev(req, res, next) {
    if(!process.env.NODE_ENV === 'development')
    {
        res.status(err.status || 401);
        return res.render('error');
    }
    next();
}

router.get('/', indexController.displayHP);

router.get('*', indexController.displayErr);

router.get('/devinfo', inDev, indexController.displayDev);

// Display (get) authentication login page
router.get('/login', indexController.displayLoginPage);
// Post login page
router.post('/login', indexController.processLoginPage);

// Display (get) authentication register page
router.get('/register', indexController.displayRegisterPage);
// Post authentication register page
router.post('/register', indexController.processRegisterPage);

// Display (get) authentication logout page
router.get('/logout', indexController.displayLogoutPage);

module.exports = router;