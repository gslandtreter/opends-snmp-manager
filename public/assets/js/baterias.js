var scotchTodo = angular.module('scotchTodo', []);



function mainController($scope, $http) {
	$scope.formData = {};
	$scope.todos = {};

    $scope.batteryPercentage = 100;

    $scope.getBatteryColor = function(percentage) {

        if(percentage > 60) {
            return "#0F0"
        }
        else if (percentage > 20) {
            return "#F90"
        }
        else {
            return "#F20"
        }
    }

    $scope.prettyFloat = function(float, decimalPlaces) {
        return parseFloat(float).toFixed(decimalPlaces)
    }

    ////////////////////////////////////////////////////////

    //Seta item do menu como ativo
    $scope.menuLoaded = function() {
        $('#menuBaterias').addClass('active');
    }

    //Obtem configs do agente
    $scope.agentConfig = JSON.parse(localStorage.getItem("agentConfig"));

    if($scope.agentConfig == null) {
        //Default
        $scope.agentConfig = {
            address: "127.0.0.1",
            port: 161
        }
    }

    $scope.uintToString = function(uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray),
            decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
    }

    function requestInitialInformation() {
        $http({
            method: 'GET',
            url: '/api/snmp/get',
            params: {
                agentIP: $scope.agentConfig.address,
                agentPort: $scope.agentConfig.port,
                oids: "1.3.6.1.4.1.12619.5.1.0," + //Brand and Model
                "1.3.6.1.4.1.12619.5.2.0," + //VIN
                "1.3.6.1.4.1.12619.5.3.0," + // MaxPower
                "1.3.6.1.4.1.12619.5.8.1.0," + // Motor Description
                "1.3.6.1.4.1.12619.5.8.3.0," + //Motor MAX Power
                "1.3.6.1.4.1.12619.5.9.1.0," + //Battery Capacity
                "1.3.6.1.4.1.12619.5.9.3.0" //Battery Module Count
            }
        }).then(function successCallback(response) {

            var responseData = response.data;

            //console.log(responseData)

            $scope.brandAndModel = $scope.uintToString(responseData[0].value.data);
            $scope.vehicleID = $scope.uintToString(responseData[1].value.data);
            $scope.maxPower = $scope.uintToString(responseData[2].value.data);
            $scope.motorDescription = $scope.uintToString(responseData[3].value.data);
            $scope.motorMaxPower = responseData[4].value;
            $scope.batteryCapacity = $scope.uintToString(responseData[5].value.data);
            $scope.batteryModuleCount = responseData[6].value;

            makeGraphs();

        }, function errorCallback(response) {

        });
    }


    function requestData() {
        $http({
            method: 'GET',
            url: '/api/snmp/get',
            params: {
                agentIP: $scope.agentConfig.address,
                agentPort: $scope.agentConfig.port,
                oids: "1.3.6.1.4.1.12619.5.4.0," + //Velocidade
                "1.3.6.1.4.1.12619.5.8.2.0," + //RPM
                "1.3.6.1.4.1.12619.5.6.0," + //Distancia Percorrida
                "1.3.6.1.4.1.12619.5.9.4.0," + //Voltagem Bateria
                "1.3.6.1.4.1.12619.5.9.5.0," + //Corrente Bateria
                "1.3.6.1.4.1.12619.5.9.2.0" //BatteryChargeState
            }
        }).then(function successCallback(response) {
            var seriesSpeed = $scope.chartCapacidadeBateria.series[0],
                shift = seriesSpeed.data.length > 20;

            var responseData = response.data;

            var speed = responseData[5].value;
            seriesSpeed.addPoint([Date.now(), speed], true, shift);

            var seriesRPM = $scope.chartCurrent.series[0];
                shift = seriesRPM.data.length > 20;

            var rpm = responseData[4].value;
            seriesRPM.addPoint([Date.now(), rpm], true, shift);

            $scope.totalPercorrido = parseFloat($scope.uintToString(responseData[2].value.data)).toFixed(2);
            $scope.batteryVoltage = responseData[3].value;
            $scope.batteryAmps = responseData[4].value;
            $scope.currentChargeState = responseData[5].value;

            $scope.batteryPercentage = ($scope.currentChargeState * 100.0) / $scope.batteryCapacity;

        }, function errorCallback(response) {

        });
    }

    function getBatteryTable() {
        $http({
            method: 'GET',
            url: '/api/snmp/getTable',
            params: {
                agentIP: $scope.agentConfig.address,
                agentPort: $scope.agentConfig.port,
                oid: "1.3.6.1.4.1.12619.5.9.6", //Tabela Bateria
                tableLines: 16,
                tableColumns: 7
            }
        }).then(function successCallback(response) {

            var table = response.data;

            $scope.tabelaBateria = table;

        }, function errorCallback(response) {

        });
    }

    function makeGraphs() {
        $scope.chartCapacidadeBateria = new Highcharts.Chart({
            chart: {
                renderTo: 'graficoCapacidadeBateria',
                defaultSeriesType: 'spline',
                events: {
                    load: requestData
                }
            },
            title: {
                text: 'Capacidade da Bateria (Wh)'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                maxZoom: 20 * 1000
            },
            yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                min: 0,
                title: {
                    text: '(Wh)',
                    margin: 80
                }
            },
            series: [{
                name: $scope.brandAndModel,
                data: []
            }]
        });

        $scope.chartCurrent = new Highcharts.Chart({
            chart: {
                renderTo: 'graficoCorrente',
                defaultSeriesType: 'spline',
                events: {
                    load: requestData
                }
            },
            title: {
                text: 'Corrente da Bateria (A)'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                maxZoom: 20 * 1000
            },
            yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                min: 0,
                title: {
                    text: '(Amperes)',
                    margin: 80
                }
            },
            series: [{
                name: $scope.brandAndModel,
                data: []
            }]
        });
    }

    requestInitialInformation();
    getBatteryTable();
    setInterval(requestData, 1000);
    setInterval(getBatteryTable, 3000);
}
