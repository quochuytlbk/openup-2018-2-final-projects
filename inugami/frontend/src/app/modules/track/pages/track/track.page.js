import angular from 'angular';

import trackPageTemplate from './track.html';

const trackModule = angular.module('app.main.track');

trackModule.component('trackPage', {
  template: trackPageTemplate,
  controller: function() {
    let vm = this;

    vm.header = 'This is the Track Objectives Page.';
  }
});
