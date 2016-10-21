var scotchTodo = angular.module('scotchTodo', []);



function mainController($scope, $http) {
	$scope.formData = {};
	$scope.todos = {};

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
                agentIP: "127.0.0.1",
                agentPort: 2001,
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

            $scope.totalPercorrido = uintToString(responseData[2].value.data);

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
