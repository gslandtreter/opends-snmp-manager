var Snmp = require('./models/snmp');

require('text-encoding');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/snmp', function(req, res) {

		// use mongoose to get all todos in the database
		Snmp.get(function(result) {

			res.json(result); // return all todos in JSON format
		});
	});


	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};