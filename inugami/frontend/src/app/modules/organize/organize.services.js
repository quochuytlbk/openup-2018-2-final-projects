import angular from 'angular';
import { Category } from 'Enums/category.enum';
import { ToDoStatus } from 'Enums/todo-status.enum';

class ToDoService {
  constructor($http, $cacheFactory) {
    this.$http = $http;
    this.$cacheFactory = $cacheFactory;
    this.observerCallbacks = [];

    this.isFirstTime = true;

    this.toDos = [];
  }

  registerObserverCallback(callback) {
    this.observerCallbacks.push(callback);
  }

  notifyObservers() {
    this.observerCallbacks.forEach(observerCallback => {
      observerCallback();
    });
  }

  async fetchToDos() {
    this.isFirstTime = false;
    if (this.toDos.length === 0 || !this.$cacheFactory.get('$http').get('/api/to-dos')) {
      const response = await this.$http.get('/api/to-dos', { cache: true });
      this.toDos = response.data.details.toDos;
    }
  }

  async getFocusedToDos() {
    await this.fetchToDos();
    return this.toDos.filter(toDo => toDo.status === ToDoStatus.FOCUSED);
  }

  async getToDoById(id) {
    await this.fetchToDos();
    const foundToDo = { ...this.toDos.find(toDo => toDo._id === id) };
    if (foundToDo.subtasks) {
      foundToDo.subtasks = foundToDo.subtasks.map(subtask => {
        if (typeof subtask.isEditing === 'boolean') {
          delete subtask.isEditing;
        }
        return subtask;
      });
    }
    foundToDo.isCompleted = foundToDo.status === ToDoStatus.COMPLETED;
    return foundToDo;
  }

  async getToDos(category, statusFilter) {
    await this.fetchToDos();
    if (statusFilter === ToDoStatus.COMPLETED) {
      return this.toDos.filter(toDo => toDo.category === category && toDo.status === ToDoStatus.COMPLETED);
    }
    return this.toDos.filter(toDo => toDo.category === category && toDo.status !== ToDoStatus.COMPLETED);
  }

  async updateToDoById(id, updateInfo, shouldNotifyObservers = true) {
    const response = await this.$http.put(`/api/to-dos/${id}`, updateInfo);
    const { updatedToDo } = response.data.details;

    if (shouldNotifyObservers) {
      this.toDos = this.toDos.map(toDo => (`${toDo._id}` === `${updatedToDo._id}` ? updatedToDo : toDo));
      this.notifyObservers();
    }
  }

  async updateToDoFocusTime(id, isCountingFocusTime, shouldNotifyObservers = true) {
    const response = await this.$http.put(`/api/to-dos/${id}/focus-time`, { isCountingFocusTime });

    const { updatedToDo } = response.data.details;

    if (shouldNotifyObservers) {
      this.toDos = this.toDos.map(toDo => (`${toDo._id}` === `${updatedToDo._id}` ? updatedToDo : toDo));
      this.notifyObservers();
    }

    return updatedToDo;
  }

  async deleteToDoById(id, shouldNotifyObservers = true) {
    await this.$http.delete(`/api/to-dos/${id}`);

    if (shouldNotifyObservers) {
      this.toDos = this.toDos.filter(toDo => `${toDo._id}` !== `${id}`);
      this.notifyObservers();
    }
  }
}

const organizeModule = angular.module('app.main.organize');

organizeModule.service('ToDoService', ToDoService);
