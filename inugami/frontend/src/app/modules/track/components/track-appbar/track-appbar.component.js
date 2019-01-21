import angular from 'angular';

import trackAppbarTemplate from './track-appbar.html';

const organizeModule = angular.module('app.main.track');

organizeModule.component('trackAppbar', {
  template: trackAppbarTemplate,
  controller: function($element) {
    let vm = this;

    vm.appbarTitle = 'Track Objectives';

    $element.addClass('layout-row layout-align-start-center full-width');
  }
});
