import angular from 'angular';

import { APP_ROUTES } from 'Config/app-routes';

const mainModule = angular.module('app.main');

mainModule.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state(APP_ROUTES.MAIN.STATE_NAME, {
        abstract: true,
        url: APP_ROUTES.MAIN.URL,
        component: 'mainLayout'
      })
      .state(APP_ROUTES.MAIN.CHILDREN.ADD.STATE_NAME, {
        url: APP_ROUTES.MAIN.CHILDREN.ADD.URL,
        views: {
          appbar: { component: 'addAppbar' },
          content: { component: 'addPage' }
        }
      })
      .state(APP_ROUTES.MAIN.CHILDREN.FOCUS.STATE_NAME, {
        url: APP_ROUTES.MAIN.CHILDREN.FOCUS.URL,
        views: {
          appbar: { component: 'focusAppbar' },
          content: { component: 'focusPage' }
        }
      })
      .state(APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME, {
        url: APP_ROUTES.MAIN.CHILDREN.ORGANIZE.URL,
        views: {
          appbar: { component: 'organizeAppbar' },
          content: { component: 'organizePage' }
        }
      })
      .state(APP_ROUTES.MAIN.CHILDREN.TRACK.STATE_NAME, {
        url: APP_ROUTES.MAIN.CHILDREN.TRACK.URL,
        views: {
          appbar: { component: 'trackAppbar' },
          content: { component: 'trackPage' }
        }
      });
  }
]);
