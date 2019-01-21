import angular from 'angular';

class AddService {
  constructor($http, $cacheFactory) {
    this.$http = $http;
    this.$cacheFactory = $cacheFactory;
  }

  async addToDo(toDo) {
    await this.$http.post('/api/to-dos', toDo);
    this.$cacheFactory.get('$http').remove('/api/to-dos');
  }
}

const addModule = angular.module('app.main.add');

addModule.service('AddService', AddService);
