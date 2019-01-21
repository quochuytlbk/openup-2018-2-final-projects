import angular from 'angular';

import leftContainerTemplate from './left-container.html';

import whiteLogo from 'Assets/images/wolf-white-face.svg';
import listIcon from 'Assets/images/check.svg';

const authModule = angular.module('app.auth');

authModule.component('leftContainer', {
  template: leftContainerTemplate,
  controller: function() {
    let vm = this;

    vm.logoUrl = whiteLogo;
    vm.listIconUrl = listIcon;
    vm.title = 'Welcome';
    vm.subtitle = "It's time to organize your to-do list!";
    vm.features = ['Utilize the Eisenhower matrix', 'Track your goals with ease', 'Share your work to the world'];
  }
});
