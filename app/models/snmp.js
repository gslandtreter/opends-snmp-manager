
//Carrega modulo net-snmp
var snmp = require ("net-snmp");

module.exports = {

    //SNMP-GET
	get: function(agentIP, agentPort, oids, callBack) {

        var options = {
            port: agentPort,
            retries: 1,
            timeout: 5000,
            transport: "udp4",
            trapPort: 162,
            version: snmp.Version2c
        };

        //Conecta ao agente
        var session = snmp.createSession (agentIP, "public", options);

        //Roda funcao SNMP GET
        session.get (oids, function (error, varbinds) {
            if (!error) {
                var retValue = [];
                for (var i = 0; i < varbinds.length; i++) {
                    if (!snmp.isVarbindError(varbinds[i])) {
                        //Obtem resultados
                        retValue.push(varbinds[i]);
                    }
                }
                //Callback retorno
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

        //Armazena espaço para a tabela
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

        //Conecta no agente
        var session = snmp.createSession (agentIP, "public", options);

        //Callback termino do loop
        function doneCb (error) {
            if (error)
                callBack(error);

            callBack(table);
        }

        //Popula tabela com retorno
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

        //Chama SNMP Walk
        session.walk (oid, 16, feedCb, doneCb);
    }
};