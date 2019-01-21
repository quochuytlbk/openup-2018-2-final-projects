import angular from 'angular';

import rightContainerTemplate from './right-container.html';

import mainLogo from 'Assets/images/logo.svg';

const authModule = angular.module('app.auth');

authModule.component('rightContainer', {
  template: rightContainerTemplate,
  controller: function($scope) {
    let vm = this;

    vm.logoUrl = mainLogo;
    vm.logoText = 'Inugami';
    vm.isLoading = false;

    vm.reload = function() {
      $scope.$digest();
    };
  }
});
