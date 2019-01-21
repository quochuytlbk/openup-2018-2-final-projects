import angular from 'angular';

import organizeSectionTemplate from './organize-section.html';

import doFirstIcon from 'Assets/images/alarm.svg';
import infoIcon from 'Assets/images/question-mark.svg';
import starIcon from 'Assets/images/yellow-star.svg';
import deadlineIcon from 'Assets/images/deadline.svg';
import lowEffortIcon from 'Assets/images/low-effort.svg';
import subTaskIcon from 'Assets/images/list.svg';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('organizeSection', {
  bindings: {
    data: '=',
    appbarData: '<',
    reload: '&'
  },
  template: organizeSectionTemplate,
  controller: function() {
    let vm = this;

    vm.tmpImg = doFirstIcon;
    vm.infoIconUrl = infoIcon;
    vm.starIconUrl = starIcon;
    vm.deadlineIconUrl = deadlineIcon;
    vm.lowEffortIconUrl = lowEffortIcon;
    vm.subTaskIconUrl = subTaskIcon;
  }
});
