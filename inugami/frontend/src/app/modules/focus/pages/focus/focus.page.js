import angular from 'angular';

import focusPageTemplate from './focus.html';

import underConstruction from 'Assets/images/under-construction.svg';
import starIcon from 'Assets/images/star.svg';
import yellowStarIcon from 'Assets/images/yellow-star.svg';
import deadlineIcon from 'Assets/images/deadline.svg';
import wolfBackgroundBoilerplate from 'Assets/images/wolf-background-boilerplate.svg';

import { ToDoStatus } from 'Enums/todo-status.enum';

const focusModule = angular.module('app.main.focus');

focusModule.component('focusPage', {
  template: focusPageTemplate,
  controller: function($element, $scope, $interval, ToDoService, AuthService) {
    let vm = this;

    vm.toDos = [];

    vm.underConstructionUrl = underConstruction;
    vm.starIconUrl = starIcon;
    vm.yellowStarIconUrl = yellowStarIcon;
    vm.deadlineIconUrl = deadlineIcon;
    vm.wolfBackgroundUrl = wolfBackgroundBoilerplate;

    vm.checkboxTooltip = 'Mark as completed';
    vm.starTooltip = 'Mark as focused';

    vm.$onInit = function() {
      vm.userName = AuthService.getCurrentUser().name;
    };

    async function initialize() {
      vm.toDos = await ToDoService.getFocusedToDos();
      vm.selectedToDo = vm.toDos[0];
      vm.isRightLoading = vm.toDos.map(toDo => false);

      if (vm.countTimeInterval) {
        $interval.cancel(vm.countTimeInterval);
      }

      vm.countTimeInterval = $interval(function() {
        vm.toDos = vm.toDos.map(toDo => {
          if (toDo.isCountingFocusTime) {
            toDo.elapsedTime = toDo.elapsedTime + 1;
            return { ...toDo };
          }
          return toDo;
        });

        if (vm.selectedToDo.isCountingFocusTime) {
          vm.selectedToDo.elapsedTime = vm.selectedToDo.elapsedTime + 1;
        }
      }, 1000);

      if (vm.selectedToDo.isCountingFocusTime) {
        const updatedToDo = await ToDoService.updateToDoFocusTime(vm.selectedToDo._id, true);
        vm.selectedToDo = updatedToDo;
      }

      $scope.$digest();
    }

    vm.selectToDo = async function(index) {
      vm.selectedToDo = vm.toDos[index];

      if (vm.selectedToDo.isCountingFocusTime) {
        const updatedToDo = await ToDoService.updateToDoFocusTime(vm.selectedToDo._id, true);
        vm.selectedToDo = updatedToDo;
        vm.toDos = vm.toDos.map((toDo, i) => {
          if (i === index) {
            return vm.selectedToDo;
          }
          return toDo;
        });

        $scope.$digest();
      }
    };

    vm.isSelected = function(index) {
      return vm.toDos.findIndex(toDo => toDo._id === vm.selectedToDo._id) === index;
    };

    vm.toggleCompleted = async function() {
      if (vm.selectedToDo.isCompleted) {
        vm.selectedToDo.status = ToDoStatus.COMPLETED;
      } else {
        vm.selectedToDo.status = ToDoStatus.ACTIVE;
      }

      vm.isLoading = true;

      await ToDoService.updateToDoById(vm.selectedToDo._id, { status: vm.selectedToDo.status });

      await initialize();

      vm.isLoading = false;
    };

    vm.stopFocusToDo = async function(index) {
      let toDo;
      if (index || index === 0) {
        toDo = vm.toDos[index];
      } else {
        toDo = vm.selectedToDo;
      }
      toDo.status = ToDoStatus.ACTIVE;

      if (index || index === 0) {
        vm.isRightLoading[index] = true;
      } else {
        vm.isLoading = true;
      }

      await ToDoService.updateToDoById(toDo._id, { status: toDo.status });

      await initialize();

      if (index || index === 0) {
        vm.isRightLoading[index] = false;
      } else {
        vm.isLoading = false;
      }
    };

    vm.toggleCountTime = async function(shouldCountTime) {
      vm.selectedToDo.isCountingFocusTime = shouldCountTime;
      vm.selectedToDo = await ToDoService.updateToDoFocusTime(vm.selectedToDo._id, shouldCountTime);
    };

    vm.formatCountTime = function(seconds) {
      if (seconds) {
        let formattedCountTime = new Date(seconds * 1000).toISOString().substr(11, 8);
        formattedCountTime = formattedCountTime.replace(':', 'h ').replace(':', 'm ') + 's';
        return formattedCountTime;
      }
      return '00h 00m 00s';
    };

    vm.toggleSubtaskCompleted = async function(index) {
      if (vm.selectedToDo.subtasks[index].isCompleted) {
        vm.selectedToDo.subtasks[index].status = ToDoStatus.COMPLETED;
      } else {
        vm.selectedToDo.subtasks[index].status = ToDoStatus.ACTIVE;
      }

      vm.isLoading = true;

      await ToDoService.updateToDoById(vm.selectedToDo._id, { subtasks: vm.selectedToDo.subtasks });

      vm.isLoading = false;
    };

    $element.addClass('layout-column layout-align-start-start padding-all');

    initialize();

    $scope.$on('$destroy', function() {
      $interval.cancel(vm.countTimeInterval);
    });
  }
});
