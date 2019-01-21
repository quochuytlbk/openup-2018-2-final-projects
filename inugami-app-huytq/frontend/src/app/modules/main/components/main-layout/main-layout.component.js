import angular from 'angular';

import mainLayoutTemplate from './main-layout.html';

const mainModule = angular.module('app.main');

mainModule.component('mainLayout', {
  template: mainLayoutTemplate,
  controller: function() {
    let vm = this;

    vm.appbarData = {};
  }
});
