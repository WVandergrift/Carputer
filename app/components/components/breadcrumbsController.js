angular
    .module('App')
    .controller('breadcrumbsCtrl', [
        '$scope',
        '$rootScope',
        function ($scope,$rootScope) {
            $rootScope.toBarActive = true;
        }
    ]);