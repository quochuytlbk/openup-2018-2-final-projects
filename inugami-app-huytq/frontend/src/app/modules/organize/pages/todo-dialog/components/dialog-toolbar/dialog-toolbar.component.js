import angular from 'angular';

import dialogToolbarTemplate from './dialog-toolbar.html';

import { ToDoStatus } from 'Enums/todo-status.enum';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('dialogToolbar', {
  bindings: {
    isLoading: '=',
    toDo: '=',
    cancel: '&'
  },
  template: dialogToolbarTemplate,
  controller: function($mdToast, ToDoService) {
    let vm = this;

    vm.toggleCompleted = async function() {
      if (vm.toDo.isCompleted) {
        vm.toDo.status = ToDoStatus.COMPLETED;
      } else {
        vm.toDo.status = ToDoStatus.ACTIVE;
      }
    };

    vm.deleteToDo = async function() {
      vm.isLoading = true;

      try {

        await ToDoService.deleteToDoById(vm.toDo._id);

        vm.isLoading = false;

        vm.cancel();

        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Sucessfully deleted to-do!')
            .position('bottom left')
            .hideDelay(3000)
        );
      } catch (err) {
        console.error(err);
        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Failed to delete to-do. The server might be having some problems.')
            .position('bottom left')
            .hideDelay(3000)
        );
      }
    }
  }
});
