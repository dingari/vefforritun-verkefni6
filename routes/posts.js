'use strict';

var express = require('express');
var router = express.Router();
var posts = require('../lib/posts_db');
var xss = require('xss');

router.get('/', ensureLoggedIn, function(req, res, next) {
	var data = {};

	posts.listPostsDesc(function(error, results) {
		if(error) {
			console.error(error);
		}

		if(results.length > 0) {
			data.posts = results;
		}

		data.user = req.session.user;
		data.sidebar = true;
		data.title = 'Póstarnir';

		res.render('posts', data);
	});
});

router.post('/', function(req, res, next) {
	var data ={};

	var title = xss(req.body.title);
	var content = xss(req.body.content);
	var date = new Date();
	var username = req.session.user;

	posts.savePost(title, content, date, username, function(error, status) {
		if(error) {
			console.error(error);
		}

		var success = true;

		if(error || !status) {
			success = false;
			data.message = 'Mistókst að vista færslu';
			data.title = title;
			data.content = content;

			res.render('posts', data);
		} else {
			res.redirect('/posts');
		}
	});
});

router.post('/delete', function(req, res, next) {
	var id = req.query.id;

	posts.deletePost(id, function(error, status) {
		if(error) {
			console.error(error);
		}

		var success = false;
		var data = {};

		if(error || !status) {
			success = false;
			data.message = 'Mistókst að eyða færslu';
		} else {
			res.redirect('/posts');
		}
	});
});


function ensureLoggedIn(req, res, next) {
	if(req.session.user) {
		next();
	} else {
		res.redirect('/restricted');
	}
}

module.exports = router;