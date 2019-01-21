import angular from 'angular';

import loginFormTemplate from './login-form.html';

import facebookIcon from 'Assets/images/facebook.svg';
import googleIcon from 'Assets/images/google-plus.svg';

import { APP_ROUTES } from 'Config/app-routes';

const authModule = angular.module('app.auth');

authModule.component('loginForm', {
  bindings: {
    isLoading: '=',
    reload: '&'
  },
  template: loginFormTemplate,
  controller: [
    '$state',
    '$scope',
    'AuthService',
    function($state, $scope, AuthService) {
      let vm = this;

      vm.facebookIconUrl = facebookIcon;
      vm.googleIconUrl = googleIcon;
      vm.userData = {
        email: '',
        password: ''
      };

      vm.submitLoginForm = async function(loginForm) {
        vm.isLoading = true;

        const errors = await AuthService.login(vm.userData.email, vm.userData.password);
        if (errors) {
          if (errors.email) {
            loginForm.email.$error = { notFound: true };
            loginForm.email.$setValidity('notFound', false);
          } else if (errors.password) {
            loginForm.password.$error = { incorrect: true };
            loginForm.password.$setValidity('incorrect', false);
          }

          vm.isLoading = false;

          vm.reload();

          $scope.$digest();
          return;
        }

        $state.go(APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME);
      };

      vm.resetServerErrors = function(loginForm) {
        if (loginForm.email.$error.notFound) {
          loginForm.email.$setValidity('notFound', true);
        }
        if (loginForm.password.$error.incorrect) {
          loginForm.password.$setValidity('incorrect', true);
        }
      };

      vm.loginWithGoogle = function() {
        window.open('/api/auth/google', 'windowname1', 'width=500, height=600');

        window.addEventListener(
          'message',
          function(e) {
            AuthService.loginWithGoogle(e.data.token);
            $state.go(APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME);
          },
          false
        );
      };
    }
  ]
});
