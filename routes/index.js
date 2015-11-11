var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var data = {title: 'Express', user: ''};
	if(req.session.user)
		data.user = req.session.user;

	res.render('index', data);
});

router.get('/restricted', function(req, res, next) {
	var data = {};

	data.message = 'Þú verður að skrá þig inn til að sjá þessa síðu!';
	data.title = 'Verkefni 6';

	res.render('index', data);
});

module.exports = router;
