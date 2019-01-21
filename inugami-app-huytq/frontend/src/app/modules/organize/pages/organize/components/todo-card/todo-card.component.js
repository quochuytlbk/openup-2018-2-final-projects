import angular from 'angular';

import toDoCardTemplate from './todo-card.html';

import starIcon from 'Assets/images/star.svg';
import yellowStarIcon from 'Assets/images/yellow-star.svg';
import deadlineIcon from 'Assets/images/deadline.svg';
import lowEffortIcon from 'Assets/images/low-effort.svg';
import mediumEffortIcon from 'Assets/images/medium-effort.svg';
import highEffortIcon from 'Assets/images/high-effort.svg';
import subTaskIcon from 'Assets/images/list.svg';

import { ToDoStatus } from 'Enums/todo-status.enum';
import { Effort } from 'Enums/effort.enum';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('todoCard', {
  bindings: {
    toDo: '=',
    appbarData: '<'
  },
  template: toDoCardTemplate,
  controller: function(ToDoService) {
    let vm = this;

    vm.starIconUrl = starIcon;
    vm.deadlineIconUrl = deadlineIcon;
    vm.subTaskIconUrl = subTaskIcon;
    vm.dueDateClass = '';

    vm.checkboxTooltip = 'Mark as completed';
    vm.starTooltip = 'Mark as focused';

    vm.isLoading = false;

    vm.$onInit = function() {
      if (vm.appbarData.statusFilter === ToDoStatus.COMPLETED) {
        vm.checkboxTooltip = 'Unmark completed';
      }

      const isFocused = vm.toDo.status === ToDoStatus.FOCUSED;
      if (isFocused) {
        vm.starIconUrl = yellowStarIcon;
        vm.starTooltip = 'Stop focusing';
      }

      vm.toDo.isCompleted = vm.toDo.status === ToDoStatus.COMPLETED;

      switch (vm.toDo.effort) {
        case Effort.LOW:
          vm.effortIconUrl = lowEffortIcon;
          break;
        case Effort.MEDIUM:
          vm.effortIconUrl = mediumEffortIcon;
          break;
        case Effort.HIGH:
          vm.effortIconUrl = highEffortIcon;
          break;
        default:
          vm.effortIconUrl = '';
      }

      if (vm.toDo.subtasks) {
        vm.toDo.numOfSubtasksDone = vm.toDo.subtasks.filter(subtask => subtask.status === ToDoStatus.COMPLETED).length;
      }

      if (vm.toDo.dueDate) {
        const now = new Date();
        const timeDiff = new Date(vm.toDo.dueDate).getTime() - now.getTime();
        if (timeDiff <= 0) {
          vm.dueDateClass = 'overdue-deadline';
        } else if (timeDiff <= 24 * 60 * 60 * 1000) {
          vm.dueDateClass = 'near-deadline';
        }
      }
    };

    vm.toggleCompleted = async function() {
      if (vm.toDo.isCompleted) {
        vm.toDo.status = ToDoStatus.COMPLETED;
      } else {
        vm.toDo.status = ToDoStatus.ACTIVE;
      }

      vm.isLoading = true;

      await ToDoService.updateToDoById(vm.toDo._id, { status: vm.toDo.status });

      vm.isLoading = false;
    };

    vm.toggleFocused = async function() {
      if (vm.toDo.status === ToDoStatus.FOCUSED) {
        vm.toDo.status = ToDoStatus.ACTIVE;
        vm.starIconUrl = starIcon;
        vm.starTooltip = 'Mark as focused';
      } else {
        vm.toDo.status = ToDoStatus.FOCUSED;
        vm.starIconUrl = yellowStarIcon;
        vm.starTooltip = 'Stop focusing';
      }

      vm.isLoading = true;

      await ToDoService.updateToDoById(vm.toDo._id, { status: vm.toDo.status });

      vm.isLoading = false;
    };
  }
});
