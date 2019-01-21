import angular from 'angular';

import manageSubtasksTemplate from './manage-subtasks.html';

import { ToDoStatus } from 'Enums/todo-status.enum';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('manageSubtasks', {
  bindings: {
    toDo: '='
  },
  template: manageSubtasksTemplate,
  controller: [
    '$timeout',
    function($timeout) {
      let vm = this;

      vm.subtaskInput = '';

      function addSubtask() {
        if (vm.subtaskInput) {
          const newSubtask = {
            name: vm.subtaskInput,
            status: ToDoStatus.ACTIVE
          };

          if (!vm.toDo.subtasks) {
            vm.toDo.subtasks = [];
          }
          vm.toDo.subtasks = [...vm.toDo.subtasks, newSubtask];

          vm.subtaskInput = '';
        }
      }

      vm.turnOnEditMode = function(index) {
        vm.toDo.subtasks[index].isEditing = true;
        $timeout(function() {
          const element = document.getElementById(`${vm.toDo._id}-subtask${index}`);
          element.focus();
        });
      };

      vm.turnOffEditMode = function(index) {
        vm.toDo.subtasks[index].isEditing = false;
      };

      vm.deleteSubtask = function(index) {
        vm.toDo.subtasks = vm.toDo.subtasks.filter((toDo, i) => index !== i);
      };

      vm.onPressEnter = function(event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          addSubtask();
        }
      };

      vm.onClickButton = function() {
        addSubtask();
      };

      vm.toggleSubtaskCompleted = function(index) {
        if (vm.toDo.subtasks[index].isCompleted) {
          vm.toDo.subtasks[index].status = ToDoStatus.COMPLETED;
        } else {
          vm.toDo.subtasks[index].status = ToDoStatus.ACTIVE;
        }
      };
    }
  ]
});
