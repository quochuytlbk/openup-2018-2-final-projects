import angular from 'angular';

import addToDoTemplate from './add-todo.html';
import { ToDoStatus } from 'Enums/todo-status.enum';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('addTodo', {
  bindings: {
    data: '<',
    reload: '&'
  },
  template: addToDoTemplate,
  controller: function($mdToast, AddService) {
    let vm = this;

    vm.submitAddForm = async function() {
      if (!vm.toDoName) {
        return;
      }

      try {
        const newToDo = {
          name: vm.toDoName,
          category: vm.data.name,
          status: ToDoStatus.ACTIVE
        };

        await AddService.addToDo(newToDo);

        await vm.reload();

        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Sucessfully added to-do!')
            .position('bottom left')
            .hideDelay(3000)
        );
      } catch (err) {
        console.error(err);
        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Failed to add to-do. The server might be having some problems.')
            .position('bottom left')
            .hideDelay(3000)
        );
      }
    };
  }
});
