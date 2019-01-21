import angular from 'angular';

import addAppbarTemplate from './add-appbar.html';

const addModule = angular.module('app.main.add');

addModule.component('addAppbar', {
  template: addAppbarTemplate,
  controller: function() {
    let vm = this;

    vm.appbarTitle = 'Add To-do';
  }
});
