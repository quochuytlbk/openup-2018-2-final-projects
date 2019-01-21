import angular from 'angular';

import './components/left-container/left-container.component';
import './components/right-container/right-container.component';

import authLayoutTemplate from './auth-layout.html';

const authModule = angular.module('app.auth');

authModule.component('authLayout', {
  template: authLayoutTemplate,
  controller: function() {
    let vm = this;
  }
});
