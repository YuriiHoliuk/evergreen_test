var evergreen = angular.module('evergreen', []);

evergreen.controller('CalcCtrl', function($scope) {
    $scope.result = 0;
    $scope.showError = false;

    $scope.calculate = function(isValid) {
        if ($scope.profit_calc.cost.$valid && $scope.profit_calc.price.$valid && $scope.profit_calc.area.$valid && $scope.profit_calc.capacity.$valid) {
            $scope.result = calc();
        } else {
            $scope.result = 0;
        }
    }

    function calc() {
        var chemIn = $scope.area * $scope.capacity * $scope.cost / 100;
        var chemOut = $scope.price * $scope.area;
        var chemRes = chemIn - chemOut;
        var dobIn = chemIn * 1.5;
        var dobOut = chemOut * 0.5;
        var dobRes = dobIn - dobOut;
        var res = dobRes - chemRes;

        return res < 999999999 ? res : res.toPrecision(1);
    }

    $scope.getError = function(error) {
        if (error.required) {
            return 'Все поля должни бить заполнени';
        } else if (error.pattern) {
            return 'Введите пожалуйста число'
        };
    }

});