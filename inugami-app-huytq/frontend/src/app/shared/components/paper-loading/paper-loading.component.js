import angular from 'angular';

import paperLoadingTemplate from './paper-loading.html';

const app = angular.module('app');

app.component('paperLoading', {
  template: paperLoadingTemplate,
  controller: function() {
    let vm = this;
  }
});
