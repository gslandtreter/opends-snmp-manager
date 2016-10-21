var scotchTodo = angular.module('scotchTodo', []);



function mainController($scope, $http) {
	$scope.formData = {};
	$scope.todos = {};

    function requestData() {
        $http({
            method: 'GET',
            url: '/api/snmp'
        }).then(function successCallback(response) {
            var series = $scope.myChart.series[0],
                shift = series.data.length > 20; // shift if the series is
                                                 // longer than 20

            var responseData = response.data;
            series.addPoint(new Array(Date.now(), parseFloat(responseData[0].value.data.toString())), true, shift);

        }, function errorCallback(response) {

        });
    }

    $scope.myChart = new Highcharts.Chart({
        chart: {
            renderTo: 'grafico',
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

    setInterval(requestData, 1000);
}
