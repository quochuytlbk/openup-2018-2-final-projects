(() => {
  const app = angular.module('sign-in', []);

  app.controller('SignInController', ['$http' , '$window', function($http, $window) {
    let obj = {};
    this.noti = '';
    this.formData = {};
    //It executes after submit
    this.loginData = function() {
      obj = {
        user: this.formData.user,
        password: this.formData.psd
      }

      $http.post('/auth', obj)
        .then((res) => {
          this.formData = {};
          $window.location.href = res.data.redirect;
        }, (res) => {
          this.noti = res.data || 'Request failed';
          this.formData.psd = '';
        });
    }
  }])
  
})();