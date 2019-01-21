import angular from 'angular';

import registerFormTemplate from './register-form.html';

import facebookIcon from 'Assets/images/facebook.svg';
import googleIcon from 'Assets/images/google-plus.svg';

import { APP_ROUTES } from 'Config/app-routes';

const authModule = angular.module('app.auth');

authModule.component('registerForm', {
  bindings: {
    isLoading: '=',
    reload: '&'
  },
  template: registerFormTemplate,
  controller: function($scope, $state, AuthService) {
    let vm = this;

    vm.facebookIconUrl = facebookIcon;
    vm.googleIconUrl = googleIcon;

    vm.userData = {
      name: '',
      email: '',
      password: ''
    };

    vm.submitRegisterForm = async function(registerForm) {
      vm.isLoading = true;

      const errors = await AuthService.register(vm.userData.name, vm.userData.email, vm.userData.password);
      if (errors) {
        if (errors.email) {
          registerForm.email.$error = { alreadyExists: true };
          registerForm.email.$setValidity('alreadyExists', false);
        }

        vm.isLoading = false;

        vm.reload();

        $scope.$digest();
        return;
      }

      vm.isLoading = false;

      $state.go(APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME);
    };

    vm.resetServerErrors = function(registerForm) {
      if (registerForm.email.$error.alreadyExists) {
        registerForm.email.$setValidity('alreadyExists', true);
      }
    };

    vm.registerWithGoogle = function() {
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
});
