
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
    }
};