import angular from 'angular';

class MainService {
  constructor($http) {
    this.$http = $http;
  }

  sayHello() {
    console.log(this.$http.defaults.headers.common.Authorization);
  }
}

const mainModule = angular.module('app.main');

mainModule.service('MainService', MainService);
