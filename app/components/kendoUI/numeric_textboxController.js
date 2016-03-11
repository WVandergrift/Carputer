angular
    .module('App')
    .controller('numericTextboxCtrl', [
        '$scope',
        function ($scope) {
            $scope.value = 50;
        }
    ]);