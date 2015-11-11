'use strict'

var express = require('express');
var router = express.Router();
var users = require('../lib/users_db');

router.post('/signup', signupHandler);
router.post('/login', loginHandler);
router.get('/signup', signupView);
router.get('/login', loginView);
router.get('/logout', logout);

function signupView(req, res, next) {
	if(req.session.user)
		res.redirect('/');
	else
		res.render('createUser');
}

function loginView(req, res, next) {
	if(req.session.user)
		res.redirect('/');
	else
		res.render('login');
}

function signupHandler(req, res, next) {
	var data = {message: ''};

	var password = req.body.password;
	var confirm = req.body.confirm;
	var username = req.body.username;

	if(password !== confirm) {
		data.message = 'Lykilorð stemma ekki';
		data.username = req.body.username;

		res.render('createUser', data);
	} else {
		users.createUser(username, password, function(error, status) {
			if(error)
				console.error(error);

			var success = true;

			if(error || !status) {
				success = false;
				data.message = 'Skráning mistókst';

				res.render('createUser', data);
			} else {
				req.session.regenerate(function() {
					req.session.user = username;
					res.redirect('/');
				});
			}			
		});	
	}
}

function loginHandler(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	users.auth(username, password, function(error, user) {
		if(error) {
			console.error(error);
		}

		if(user) {
			req.session.regenerate(function() {
				req.session.user = user.username;
				res.redirect('/');
			});
		} else {
			res.render('login', {message: 'Innskráning mistókst', username: username});
		}
	});
}

function logout(req, res, next) {
	req.session.destroy(function() {
		res.redirect('/');
	});
}

function ensureLoggedIn(req, res, next) {
	if(req.session.user)
		next();
	else
		res.redirect('/');
}

module.exports = router;