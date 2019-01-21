import angular from 'angular';

import organizeAppbarTemplate from './organize-appbar.html';

import { ToDoStatus } from 'Enums/todo-status.enum';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('organizeAppbar', {
  bindings: {
    appbarData: '='
  },
  template: organizeAppbarTemplate,
  controller: function($element, ToDoService) {
    let vm = this;

    vm.appbarTitle = 'Organize To-dos';

    vm.isActiveSelected = true;

    vm.selectActiveToDos = function() {
      vm.appbarData.statusFilter = ToDoStatus.ACTIVE;
      vm.isActiveSelected = true;
      ToDoService.notifyObservers();
    };

    vm.changeNameFilter = function() {
      ToDoService.notifyObservers();
    }

    vm.selectCompletedToDos = function() {
      vm.appbarData.statusFilter = ToDoStatus.COMPLETED;
      vm.isActiveSelected = false;
      ToDoService.notifyObservers();
    };

    $element.addClass('layout-row layout-align-start-center full-width');

    vm.$onInit = function() {
      vm.appbarData = {
        statusFilter: ToDoStatus.ACTIVE
      };
    };
  }
});
