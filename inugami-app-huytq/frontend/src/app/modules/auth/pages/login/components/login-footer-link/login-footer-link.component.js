import angular from 'angular';

import loginFooterLinkTemplate from './login-footer-link.html';

import { APP_ROUTES } from 'Config/app-routes';

const authModule = angular.module('app.auth');

authModule.component('loginFooterLink', {
  template: loginFooterLinkTemplate,
  controller: function() {
    let vm = this;

    vm.registerPageStateName = APP_ROUTES.AUTH.CHILDREN.REGISTER.STATE_NAME;
  }
});
