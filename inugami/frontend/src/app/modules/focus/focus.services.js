import angular from 'angular';

class FocusService {
  constructor($http) {
    this.count = 0;
    this.$http = $http;
  }

  sayHello() {
    this.count = this.count + 1;
    console.log(this.count);
  }
}

const focusModule = angular.module('app.main.focus');

focusModule.service('FocusService', FocusService);
