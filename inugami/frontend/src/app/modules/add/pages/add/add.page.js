import angular from 'angular';

import addPageTemplate from './add.html';

import { Category } from 'Enums/category.enum';
import { ToDoStatus } from 'Enums/todo-status.enum';
import { Effort } from 'Enums/effort.enum';

import { APP_ROUTES } from 'Config/app-routes';

import taskBackground from 'Assets/images/task-background.svg';

const defaultToDo = {
  name: '',
  dueDate: '',
  category: '',
  objective: '',
  status: ToDoStatus.ACTIVE
};

const addModule = angular.module('app.main.add');

addModule.component('addPage', {
  template: addPageTemplate,
  controller: function($element, $scope, $mdToast, $state, AddService) {
    let vm = this;

    vm.taskBackgroundUrl = taskBackground;

    vm.categories = [Category.DO_FIRST, Category.SCHEDULE, Category.DELEGATE, Category.ELIMINATE];
    vm.efforts = [Effort.LOW, Effort.MEDIUM, Effort.HIGH];
    vm.isLoading = false;

    $element.addClass('layout-row layout-align-center-center');

    function resetToDoData() {
      vm.toDo = { ...defaultToDo };
    }

    resetToDoData();

    vm.submitAddForm = async function() {
      vm.isLoading = true;

      try {
        await AddService.addToDo(vm.toDo);

        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Sucessfully added to-do!')
            .position('bottom left')
            .hideDelay(3000)
        );

        resetToDoData();

        $state.go(APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME);
      } catch (err) {
        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Failed to add to-do. The server might be having some problems.')
            .position('bottom left')
            .hideDelay(3000)
        );
      }

      vm.isLoading = false;

      $scope.$digest();
    };
  }
});
