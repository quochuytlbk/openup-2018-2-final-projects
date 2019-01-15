(() => {
  const app = angular.module('sign-up', []);
  
  app.controller('SignUpController', ['$http', '$window', function($http, $window) {
    let obj = {};
    this.noti = '';
    this.formData = {};

    //It executes after submit
    this.createData = function() {
      //Compare two passwords
      if (this.formData.psd !== this.formData.cfmPsd) {
        this.noti = 'password is not match' 
      }
      obj = {
        username: this.formData.username,
        email: this.formData.email,
        password: this.formData.psd
      }
      
      $http.post('/users', obj)
        .then((res) => {
          this.formData = {}
          $window.location.href = '/games/signin';
        }, (res) => {
          this.noti = res.data || 'Request failed';
          this.formData.psd = '';
          this.formData.cfmPsd = '';
        }); 
    }
  }]) 
})();