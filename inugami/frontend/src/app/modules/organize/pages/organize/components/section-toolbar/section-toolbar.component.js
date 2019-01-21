import angular from 'angular';

import sectionToolbarTemplate from './section-toolbar.html';

import infoIcon from 'Assets/images/question-mark.svg';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('sectionToolbar', {
  bindings: {
    data: '<'
  },
  template: sectionToolbarTemplate,
  controller: function() {
    let vm = this;

    vm.infoIconUrl = infoIcon;
  }
});
