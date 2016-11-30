var scotchTodo = angular.module('scotchTodo', []);



function mainController($scope, $http) {
	$scope.formData = {};
	$scope.todos = {};

    //Teste style baterias. Deve vir das chamadas SNMP
    $scope.battery0 = {};
    $scope.battery0.percentage = 95;
    $scope.battery0.color = "#0F0";

    $scope.battery1 = {};
    $scope.battery1.percentage = 45;
    $scope.battery1.color = "#F90";

    $scope.battery2 = {};
    $scope.battery2.percentage = 25;
    $scope.battery2.color = "#F20";

    $scope.batteries = [$scope.battery0, $scope.battery1, $scope.battery2];
    ////////////////////////////////////////////////////////

    //Seta item do menu como ativo
    $scope.menuLoaded = function() {
        $('#menuIndex').addClass('active');
    }

    //Obtem configs do agente
    $scope.agentConfig = JSON.parse(localStorage.getItem("agentConfig"));

    if($scope.agentConfig == null) {
        //Default
        $scope.agentConfig = {
            address: "127.0.0.1",
            port: 2001
        }
    }

    function uintToString(uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray),
            decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
    }

    function requestData() {
        $http({
            method: 'GET',
            url: '/api/snmp',
            params: {
                agentIP: $scope.agentConfig.address,
                agentPort: $scope.agentConfig.port,
                oids: "1.3.6.1.4.1.12619.5.4.0,1.3.6.1.4.1.12619.5.8.2.0,1.3.6.1.4.1.12619.5.6.0"
            }
        }).then(function successCallback(response) {
            var seriesSpeed = $scope.chartSpeed.series[0],
                shift = seriesSpeed.data.length > 20;

            var responseData = response.data;

            var speed = responseData[0].value;
            seriesSpeed.addPoint([Date.now(), speed], true, shift);

            var seriesRPM = $scope.chartRPM.series[0];
                shift = seriesRPM.data.length > 20;

            var rpm = responseData[1].value;
            seriesRPM.addPoint([Date.now(), rpm], true, shift);

            $scope.totalPercorrido = parseFloat(uintToString(responseData[2].value.data)).toFixed(2);

        }, function errorCallback(response) {

        });
    }

    $scope.chartSpeed = new Highcharts.Chart({
        chart: {
            renderTo: 'graficoSpeed',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Velocidade (KM/h)'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: '(KM/h)',
                margin: 80
            }
        },
        series: [{
            name: 'Carro1',
            data: []
        }]
    });

    $scope.chartRPM = new Highcharts.Chart({
        chart: {
            renderTo: 'graficoRPM',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Revoluções por Minuto (RPM)'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'RPM',
                margin: 80
            }
        },
        series: [{
            name: 'Carro1',
            data: []
        }]
    });

    setInterval(requestData, 1000);
}
