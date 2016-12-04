var scotchTodo = angular.module('gerenteSNMP', []);



function mainController($scope, $http) {
	$scope.formData = {};
    $scope.agentAddress = "";
    $scope.agentPort = "";

    //Seta item do menu como ativo
    $scope.menuLoaded = function() {
        $('#menuConfig').addClass('active');
    };

    //Função que salva os valores de configuracao no localStorage
    $scope.vaiFilhao = function() {
        //Salva valores na localStorage
        var agentConfig = {
            address: $scope.agentAddress,
            port: $scope.agentPort
        }

        localStorage.setItem("agentConfig", JSON.stringify(agentConfig));
        alert("Configurações salvas com sucesso!")
    };

    //Obtem valores da localStorage
    var agentConfig = JSON.parse(localStorage.getItem("agentConfig"));

    if(agentConfig != null) {
        $scope.agentAddress = agentConfig.address;
        $scope.agentPort = agentConfig.port;
    }
}
