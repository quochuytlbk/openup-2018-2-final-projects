import angular from 'angular';

import { APP_ROUTES } from 'Config/app-routes';

const authModule = angular.module('app.auth');

authModule.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    const loginPageUrl = APP_ROUTES.AUTH.CHILDREN.LOGIN.FULL_URL;

    $urlRouterProvider.when('/', loginPageUrl);

    $urlRouterProvider.otherwise(loginPageUrl);

    $stateProvider
      .state(APP_ROUTES.AUTH.STATE_NAME, {
        abstract: true,
        url: APP_ROUTES.AUTH.URL,
        component: 'authLayout'
      })
      .state(APP_ROUTES.AUTH.CHILDREN.LOGIN.STATE_NAME, {
        url: APP_ROUTES.AUTH.CHILDREN.LOGIN.URL,
        views: {
          form: { component: 'loginForm' },
          footer: { component: 'loginFooterLink' }
        }
      })
      .state(APP_ROUTES.AUTH.CHILDREN.REGISTER.STATE_NAME, {
        url: APP_ROUTES.AUTH.CHILDREN.REGISTER.URL,
        views: {
          form: { component: 'registerForm' },
          footer: { component: 'registerFooterLink' }
        }
      });
  }
]);
