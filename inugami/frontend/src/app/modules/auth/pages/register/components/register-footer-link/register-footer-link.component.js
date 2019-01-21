import angular from 'angular';

import registerFooterLinkTemplate from './register-footer-link.html';

import { APP_ROUTES } from 'Config/app-routes';

const authModule = angular.module('app.auth');

authModule.component('registerFooterLink', {
  template: registerFooterLinkTemplate,
  controller: function() {
    let vm = this;

    vm.loginPageStateName = APP_ROUTES.AUTH.CHILDREN.LOGIN.STATE_NAME;
  }
});
