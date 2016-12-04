var Snmp = require('./models/snmp');

require('text-encoding');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// snmp get
	app.get('/api/snmp/get', function(req, res) {

			var agentIP = req.query.agentIP;
			var agentPort = req.query.agentPort;
			var oids = req.query.oids.split(",");

			// Obtem dados via SNMP
			Snmp.get(agentIP, agentPort, oids, function (result) {
				try {
					res.json(result); // return all data in JSON format
				}
				catch(err) {
					console.log("ERRO!! - " + err);
				}
			});
	});

	//Get Table - Obtem tabela SNMP
	app.get('/api/snmp/getTable', function (req, res) {

		var agentIP = req.query.agentIP;
		var agentPort = req.query.agentPort;
		var oid = req.query.oid;
		var lines = req.query.tableLines;
		var columns = req.query.tableColumns;

		Snmp.getTable(agentIP, agentPort, oid, lines, columns, function (table) {
			try {
				res.json(table); // return all data in JSON format
			}
			catch (err) {
				console.log("ERRO!! - " + err);
			}
		});
	});



	//Rota para conteúdo estático (index.html)
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};