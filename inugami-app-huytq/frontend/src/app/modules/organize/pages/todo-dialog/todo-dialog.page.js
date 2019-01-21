import angular from 'angular';
import moment from 'moment';

import toDoDialogTemplate from './todo-dialog.html';

import { APP_ROUTES } from 'Config/app-routes';

import { Category } from 'Enums/category.enum';
import { Effort } from 'Enums/effort.enum';

const organizeModule = angular.module('app.main.organize');

organizeModule.config([
  '$stateProvider',
  '$locationProvider',
  function($stateProvider, $locationProvider, ToDoService) {
    $locationProvider.html5Mode(true);

    $stateProvider.state('main.organize.todo', {
      url: '/:todoId',
      onEnter: [
        '$state',
        '$mdDialog',
        '$stateParams',
        function($state, $mdDialog, $stateParams) {
          function DialogController($scope, ToDoService) {
            $scope.categories = [Category.DO_FIRST, Category.SCHEDULE, Category.DELEGATE, Category.ELIMINATE];
            $scope.efforts = [Effort.LOW, Effort.MEDIUM, Effort.HIGH];
            $scope.objectives = [];
            $scope.isLoading = false;

            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };

            $scope.submitEditForm = async function() {
              $scope.isLoading = true;

              console.log($scope.toDo);

              await ToDoService.updateToDoById($scope.toDo._id, $scope.toDo);

              $scope.isLoading = false;

              $mdDialog.cancel();

              $scope.$digest();
            };

            (async () => {
              $scope.toDo = await ToDoService.getToDoById($stateParams.todoId);

              if ($scope.toDo.dueDate) {
                $scope.toDo.dueDate = moment($scope.toDo.dueDate);
              }
            })();
          }

          $mdDialog
            .show({
              controller: DialogController,
              template: toDoDialogTemplate,
              parent: angular.element(document.body),
              clickOutsideToClose: true,
              fullscreen: false
            })
            .then(
              function() {},
              function() {
                $state.go(APP_ROUTES.MAIN.CHILDREN.ORGANIZE.STATE_NAME);
              }
            );
        }
      ],
      onExit: [
        '$mdDialog',
        function($mdDialog) {
          $mdDialog.cancel();
        }
      ]
    });
  }
]);
