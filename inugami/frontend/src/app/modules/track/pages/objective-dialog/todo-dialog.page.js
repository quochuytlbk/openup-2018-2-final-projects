import angular from 'angular';

import toDoDialogTemplate from './todo-dialog.html';

import { APP_ROUTES } from 'Config/app-routes';

const organizeModule = angular.module('app.main.organize');

organizeModule.config([
  '$stateProvider',
  '$locationProvider',
  function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider.state('main.organize.todo', {
      url: '/:todoId',
      onEnter: [
        '$state',
        '$mdDialog',
        '$stateParams',
        function($state, $mdDialog, $stateParams) {
          function DialogController($scope, OrganizeService) {
            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
              $mdDialog.hide(answer);
            };

            (async () => {
              $scope.toDo = await OrganizeService.getToDoById($stateParams.todoId);
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
              function(answer) {
                console.log(answer);
              },
              function() {
                $state.go('main.organize');
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
