import angular from 'angular';

import { APP_ROUTES } from 'Config/app-routes';

const app = angular.module('app');

app.run(function($transitions) {
  $transitions.onStart({ to: `${APP_ROUTES.MAIN.STATE_NAME}.**` }, function(trans) {
    const AuthService = trans.injector().get('AuthService');
    if (!AuthService.isAuthenticated()) {
      return trans.router.stateService.target(APP_ROUTES.AUTH.CHILDREN.LOGIN.STATE_NAME);
    }
  });

  $transitions.onStart({ to: `${APP_ROUTES.AUTH.STATE_NAME}.**` }, function(trans) {
    const AuthService = trans.injector().get('AuthService');
    if (AuthService.isAuthenticated()) {
      return trans.router.stateService.target(APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME);
    }
  });
});

app.config(function($provide, $httpProvider) {
  $provide.factory('unauthorizedInterceptor', [
    '$q',
    '$state',
    '$window',
    function($q, $state, $window) {
      return {
        responseError: function(rejection) {
          if (rejection.status === 401) {
            $state.go(APP_ROUTES.AUTH.CHILDREN.LOGIN.STATE_NAME);
            $window.alert('Session timed-out. Please re-login.');
          }

          return $q.reject(rejection);
        }
      };
    }
  ]);

  $httpProvider.interceptors.push('unauthorizedInterceptor');
});
