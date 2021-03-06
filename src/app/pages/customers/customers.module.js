(function () {
    'use strict';

    var customers = angular.module('BlurAdmin.pages.customers', ['ngCookies']);

    customers.factory('sessionInjector', function ($cookies) {
        var sessionInjector = {
            request: function (config) {

                config.headers['Authorization'] = "Bearer " + $cookies.getObject('token');

                return config;
            }
        };
        return sessionInjector;
    });
    customers.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
    }]);


    customers.config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('customers', {
                url: '/customers',
                template : '<ui-view></ui-view>',
                abstract: true,
                controller: 'CustomerController',
                title: 'Customers',
                sidebarMeta: {
                    icon: 'ion-grid',
                    order: 300
                }
            })
            .state('customers.list', {
                controller: 'CustomerController',
                url: '/list',
                templateUrl: 'app/pages/customers/customers.html',
                title: 'List',
                sidebarMeta: {
                    order: 100,
                },
            }).state('customers.customer', {
            title: 'Edit',
            controller: 'CustomerIdController',
            url: '/edit/:id',
            templateUrl: 'app/pages/customers/customer.html',
            sidebarMeta: {
                order: 200,
            }

        })
            .state('customers.order', {
                title: 'Order',
                controller: 'CustomerOrderController',
                url: '/order/:id',
                templateUrl: 'app/pages/customers/order.html',
                sidebarMeta: {
                    order: 200,
                }

            })
    }

    customers.controller("CustomerController", function ($scope, $http,
                                                   $filter, editableOptions,
                                                   editableThemes,
                                                   $window) {
        $scope.test = "Test"
        $scope.smartTablePageSize = 10;
        $scope.smartTableData = [
            {
                id: 1,
                firstName: 'Mark',
                lastName: 'Otto',
                username: '@mdo',
                email: 'mdo@gmail.com',
                age: '28'
            },
            {
                id: 2,
                firstName: 'Jacob',
                lastName: 'Thornton',
                username: '@fat',
                email: 'fat@yandex.ru',
                age: '45'
            }

        ];
        $scope.init = function () {
            $http.get("/admin/customer/").then(function (promise) {
                $scope.customers = promise.data;
                $scope.customersReady = true;
            }, function (error) {
                console.log(error);
                $window.location.href = '/auth.html';
            })
        }

    })
    customers.controller("CustomerIdController", function ($scope,
                                                           $http, $stateParams, $location) {
        $scope.test = "Test"
        $scope.smartTablePageSize = 10;

        $scope.init = function () {
            var id = $stateParams.id;
            if(id) {
                console.log(id);
                $http.get('/admin/customer/' + id).then(function (promise) {
                    console.log(promise.data);
                    $scope.customer = promise.data;
                });

                $http.get('/admin/customer/' + id + '/order/').then(function (promise) {
                    console.log(promise.data);
                    $scope.orders = promise.data;
                    $scope.ordersReady = true;
                });
            }else{
                $location.path('/customers/list');
            }
        }


    })

    customers.controller("CustomerOrderController", function ($scope, $http,
                                                              $stateParams, $location) {
        $scope.test = "Test"
        $scope.smartTablePageSize = 10;

        $scope.init = function () {
            var id = $stateParams.id;
            if(id) {
                console.log(id);
                $http.get('/admin/customer/order/' + id).then(function (promise) {
                    console.log(promise.data);
                    $scope.order = promise.data;
                    $scope.order.statuses =  [{name: 'pending'}, {name: 'paid'}]
                })
            }else{
                $location.path('/customers/list');
            }
        }


    })

})();
/**
 * Created by kshakirov on 11/18/16.
 */


