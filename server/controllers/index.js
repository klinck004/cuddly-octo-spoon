let express = require('express');
let router = express.Router();

// Authentication
let passport = require('passport');
let userModel = require('../models/user.js');
let User = userModel.User;

console.log("Index controller loaded!"); /* for dev peace of mind */
module.exports.displayHP = (req, res, next) => {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName : ''
    });
};

module.exports.displayDev = (req, res, next) => {
    res.render('devInfo', {
        title: 'Dev Info',
        displayName: req.user ? req.user.displayName : ''
    });
};

module.exports.displayErr = (err, req, res, next) => {
    res.render('error.ejs', {
        error: err,
        displayName: req.user ? req.user.displayName : ''
    });
};

// Get login auth
module.exports.displayLoginPage = (req, res, next) => {
    if (!req.user) // If not logged in, display login
    {
        if (process.env.NODE_ENV === 'development') { // Development verbose output
            res.render('auth/login',
                {
                    title: 'Login',
                    message: req.flash('loginMessage'),
                    devMessage: req.flash('infoMessage'),
                    displayName: req.user ? req.user.displayName : ''
                })
        } else {
            res.render('auth/login',
                {
                    title: 'Login',
                    message: req.flash('loginMessage'),
                    displayName: req.user ? req.user.displayName : '',
                    devMessage: ""
                })
        }
    }
    else { // If logged in, do not do anything
        return res.redirect('/')
    }
};

// Post login auth
module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', function (err, User, info) {
        if (err) // Server error
        {
            err.type = "Auth server error"
            err.status = 500
            console.log("Auth server error:");
            console.log(err);
            return next(err);
        }
        // Login auth error
        if (!User) {
            req.flash('loginMessage', 'Password is incorrect or missing.');
            console.log("Returned info");
            console.log(info);
            return res.redirect('login')
        }

        req.login(User, (err) => {
            if (err) {
                err.type = "Auth login error"
                err.status = 500
                console.log("Auth login error:");
                console.log(err);
                return next(err)
            }
            return res.redirect('back')
        })
    })(req, res)
};

// Get registration
module.exports.displayRegisterPage = (req, res, next) => {
    if (!req.user) // If not logged in, display login
    {
        res.render('auth/register',
            {
                title: 'Register',
                message: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : '',
                devMessage: req.flash('infoMessage'),
            })
    }
    else { // If logged in, do not do anything
        return res.redirect('/')
    }
};

// Post registration
module.exports.processRegisterPage = (req, res, next) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName
    })
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            if (process.env.NODE_ENV === 'development') {
                console.log("Error: User cannot be created!");
                console.log(err);
                req.flash('infoMessage', err.name);
            }
            if (err.name == 'UserExistsError') { 
                req.flash('registerMessage', "Error: A user with this username already exists.");
            }
            return res.redirect('register')
        }
        else {
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            })
        }
    })
};

// Get logout
module.exports.displayLogoutPage = (req, res, next) => {
    res.render('auth/logout',
        {
            title: 'Logged out',
        })
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    })

};