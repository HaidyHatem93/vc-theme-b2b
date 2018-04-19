﻿var storefrontApp = angular.module('storefrontApp');

storefrontApp.controller('collectionController', ['$scope', '$location', '$localStorage', function ($scope, $location, $localStorage) {
    $scope.currentFulfillmentCenter = { id: null };
    var $ctrl = this;
    $ctrl.init = function() {
        $ctrl.sortModes = {
            'manual': 'collections.sorting.featured',
            'best-selling': 'collections.sorting.best_selling',
            'title-ascending': 'collections.sorting.az',
            'title-descending': 'collections.sorting.za',
            'price-ascending': 'collections.sorting.price_ascending',
            'price-descending': 'collections.sorting.price_descending',
            'createddate-descending': 'collections.sorting.date_descending',
            'createddate-ascending': 'collections.sorting.date_ascending'
        };
        $ctrl.viewQuery = { view: ['grid'] };
        $ctrl.keywordQuery = { keyword: [], branch:[] };
        if ($localStorage['selectedBranch']) {
            $scope.currentFulfillmentCenter = $localStorage['selectedBranch'];
        }
    }
    
    $ctrl.generatePageSizes = function (capacity, steps) {
        $ctrl.pageSizeQuery = { page_size: [capacity] };
        // for example            start: 16 stop: 16 * 3 + 1 = 49 step: 16
        $ctrl.pageSizes = _.range(capacity, capacity * steps + 1, capacity);
    }
    
    
    $ctrl.selectedBranch = function() {
        var sc = $scope;
        if ($ctrl.searchInBranch) {
            $ctrl.keywordQuery.branch = null;
            $ctrl.searchInBranch = false;
        }
        else {
            $ctrl.keywordQuery.branch = [$scope.getCurrentFulfillment()];
            $ctrl.searchInBranch = true;
        }
    }

    $scope.getCurrentFulfillment = function() {
        var result = null;
        if ($scope.currentFulfillmentCenter) {
            result = $scope.currentFulfillmentCenter.id;
        }
        return result;
    };
 
    $ctrl.checkedBranch = function() {
        $ctrl.searchInBranch = false;
        if ($ctrl.keywordQuery.branch && $scope.currentFulfillmentCenter) {
            $ctrl.searchInBranch = $ctrl.keywordQuery.branch[0] === $scope.currentFulfillmentCenter.id;
        }
    }

    $scope.$on('$locationChangeSuccess', function(event) {
        $ctrl.checkedBranch();
    });

    $scope.$watch('currentFulfillmentCenter.id', function (fulfillmentCenterId) {
        if ($ctrl.searchInBranch && fulfillmentCenterId) {
            $ctrl.searchInBranch = false;
        }
    }, true);

    $ctrl.init();
}]);
