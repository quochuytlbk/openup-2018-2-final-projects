import angular from 'angular';

const app = angular.module('app');

app.filter('capitalizeFirstLetter', function() {
  return inputString => {
    if (inputString) {
      return inputString
        .toLowerCase()
        .split(' ')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    }
    return '';
  };
});
