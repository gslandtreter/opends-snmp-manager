var Snmp = require('./models/snmp');

require('text-encoding');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/snmp/get', function(req, res) {

		var agentIP = req.query.agentIP;
		var agentPort = req.query.agentPort;
		var oids = req.query.oids.split(",");

		// use mongoose to get all todos in the database
		Snmp.get(agentIP, agentPort, oids, function(result) {
			res.json(result); // return all todos in JSON format
		});
	});

    app.get('/api/snmp/getTable', function(req, res) {

        var agentIP = req.query.agentIP;
        var agentPort = req.query.agentPort;
        var oid = req.query.oid;
        var lines = req.query.tableLines;
        var columns = req.query.tableColumns;

        // use mongoose to get all todos in the database
        Snmp.getTable(agentIP, agentPort, oid, lines, columns, function(table) {

            res.json(table); // return all todos in JSON format
        });
    });



	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};