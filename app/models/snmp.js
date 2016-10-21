
var snmp = require ("net-snmp");

var options = {
    port: 2001,
    retries: 1,
    timeout: 5000,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version2c
};

var session = snmp.createSession ("127.0.0.1", "public", options);

var oids = ["1.3.6.1.2.1.1.99.0"];

module.exports = {

	get: function(callBack) {
        session.get (oids, function (error, varbinds) {
            if (error) {
                console.error (error);
            } else {
                var retValue = new Array();
                for (var i = 0; i < varbinds.length; i++) {
                    if (!snmp.isVarbindError(varbinds[i])) {
                        retValue.push(varbinds[i]);

                    }
                }
                callBack(retValue);
            }
        });
    }
};