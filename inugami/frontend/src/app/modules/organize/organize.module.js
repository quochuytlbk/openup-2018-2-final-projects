import angular from 'angular';

angular.module('app.main.organize', []);

require('./components/loading-screen/loading-screen.component');
require('./components/organize-appbar/organize-appbar.component');
require('./pages/organize/components/add-todo/add-todo.component');
require('./pages/organize/components/section-toolbar/section-toolbar.component');
require('./pages/organize/components/todo-card/todo-card.component');
require('./pages/organize/components/organize-section/organize-section.component');
require('./pages/organize/organize.page');
require('./pages/todo-dialog/components/dialog-toolbar/dialog-toolbar.component');
require('./pages/todo-dialog/components/manage-subtasks/manage-subtasks.component');
require('./pages/todo-dialog/todo-dialog.page');
require('./organize.services');
