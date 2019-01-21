import angular from 'angular';

import focusAppbarTemplate from './focus-appbar.html';

const focusModule = angular.module('app.main.focus');

focusModule.component('focusAppbar', {
  template: focusAppbarTemplate,
  controller: function() {
    let vm = this;

    vm.appbarTitle = 'Focused To-dos';
  }
});
