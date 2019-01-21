import angular from 'angular';

import sidebarTemplate from './sidebar.html';

import inugamiLogo from 'Assets/images/logo.svg';
import addIcon from 'Assets/images/add-plus-button.svg';
import focusIcon from 'Assets/images/mark-as-favorite-star.svg';
import organizeIcon from 'Assets/images/wolf-howling.svg';
import trackIcon from 'Assets/images/animal-track.svg';
import settingIcon from 'Assets/images/settings-work-tool.svg';

import { APP_ROUTES } from 'Config/app-routes';

const mainModule = angular.module('app.main');

mainModule.component('sidebar', {
  template: sidebarTemplate,
  controller: function($state, AuthService) {
    let vm = this;

    vm.logoUrl = inugamiLogo;

    vm.sidebarTopItems = [
      {
        name: 'Add To-do',
        description: 'Add what you should do',
        icon: addIcon,
        stateName: APP_ROUTES.MAIN.CHILDREN.ADD.STATE_NAME
      },
      {
        name: 'Focused To-dos',
        description: 'Focus on important to-dos',
        icon: focusIcon,
        stateName: APP_ROUTES.MAIN.CHILDREN.FOCUS.STATE_NAME
      },
      {
        name: 'Organize To-dos',
        description: 'Manage, organize and prioritize your to-dos',
        icon: organizeIcon,
        stateName: APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME
      }
      // {
      //   name: 'Track Objectives',
      //   description: 'Define and track your objectives',
      //   icon: trackIcon,
      //   stateName: APP_ROUTES.MAIN.CHILDREN.TRACK.STATE_NAME
      // }
    ];

    vm.settings = {
      name: 'Settings',
      icon: settingIcon
    };

    let originatorEv;

    vm.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

    vm.logout = function() {
      AuthService.logout();

      $state.go(APP_ROUTES.AUTH.CHILDREN.LOGIN.STATE_NAME);

      originatorEv = null;
    };
  }
});
