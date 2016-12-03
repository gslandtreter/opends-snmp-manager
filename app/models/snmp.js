
var snmp = require ("net-snmp");

//var oids = ["1.3.6.1.2.1.1.99.0"];

module.exports = {

	get: function(agentIP, agentPort, oids, callBack) {

        var options = {
            port: agentPort,
            retries: 1,
            timeout: 5000,
            transport: "udp4",
            trapPort: 162,
            version: snmp.Version2c
        };

        var session = snmp.createSession (agentIP, "public", options);

        session.get (oids, function (error, varbinds) {
            if (!error) {
                var retValue = [];
                for (var i = 0; i < varbinds.length; i++) {
                    if (!snmp.isVarbindError(varbinds[i])) {
                        retValue.push(varbinds[i]);

                    }
                }
                callBack(retValue);
            } else {
                console.error(error);
                callBack(null);
            }
        });
    },

    getTable: function(agentIP, agentPort, oid, lines, columns, callBack) {

        function Create2DArray(rows) {
            var arr = [];

            for (var i=0;i<rows;i++) {
                arr[i] = [];
            }

            return arr;
        }

        table = Create2DArray(lines);
        var tableRows = 0;

        var options = {
            port: agentPort,
            retries: 1,
            timeout: 5000,
            transport: "udp4",
            trapPort: 162,
            version: snmp.Version2c
        };

        var session = snmp.createSession (agentIP, "public", options);

        function doneCb (error) {
            if (error)
                callBack(error);

            callBack(table);
        }

        function feedCb (varbinds) {

            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError (varbinds[i]))
                    console.error (snmp.varbindError (varbinds[i]));
                else if (tableRows < columns) {
                    table[i][tableRows] = varbinds[i].value;
                }
            }
            tableRows++
        }

        session.walk (oid, 16, feedCb, doneCb);
    }
};