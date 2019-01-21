import express, { Router, Request, Response, NextFunction } from 'express';

import { UserContentModel } from '../models/UserContent';
import { ToDoModel } from '../models/ToDo';

import { ApiResponse } from '../payload/response/ApiResponse';
import { ApiDetailResponse } from '../payload/response/ApiDetailResponse';
import { ApiErrorResponse } from '../payload/response/ApiErrorResponse';

import { HTTPStatus } from '../enums/HTTPStatusEnum';
import { ToDoStatus } from '../enums/ToDoStatusEnum';

import { getNullFilteredObject, getNullFilteredAndDotifiedObject } from '../helpers/filters/objectFilters';
import { recalculateToDoFocusTime } from '../services/recalculateToDoFocusTime';

class ToDoController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getToDos);
    this.expressRouter.post('', this.addToDo);
    this.expressRouter.put('/:_id', this.updateToDoById);
    this.expressRouter.put('/:_id/focus-time', this.updateToDoFocusTime);
    this.expressRouter.delete('/:_id', this.deleteToDoById);
  };

  private getToDos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id: userId } = req.user;

      const userContent = await UserContentModel.findOne({ userId });

      if (userContent.toDos.length === 0) {
        const errors = {
          toDos: 'No to-dos found.'
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Failed to get to-dos of current user.', errors);
        return res.status(HTTPStatus.NOT_FOUND).json(apiErrorResponse);
      }

      const details = {
        toDos: userContent.toDos
      };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all to-dos.', details);
      return res.status(HTTPStatus.OK).json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private addToDo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id: userId } = req.user;

      const userContent = await UserContentModel.findOne({ userId });

      const { name, dueDate, category, effort, status } = req.body;

      let newToDo = new ToDoModel(
        getNullFilteredObject({
          name,
          dueDate,
          category,
          effort,
          status
        })
      );

      await newToDo.validate();

      userContent.toDos = [...userContent.toDos, newToDo];

      await userContent.save();

      const apiResponse = new ApiResponse(true, 'Successfully added to-do.');
      return res.status(HTTPStatus.OK).json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateToDoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id: userId } = req.user;

      let userContent = await UserContentModel.findOne({ userId });

      const { _id } = req.params;
      const { name, effort, dueDate, notes, status, category, subtasks, objective } = req.body;

      let fieldsToBeUpdated = getNullFilteredAndDotifiedObject({
        name,
        effort,
        dueDate,
        notes,
        status,
        category,
        objective
      });

      userContent.toDos = userContent.toDos.map((toDo: any) => {
        if (`${toDo._id}` === _id) {
          if (subtasks) {
            toDo.subtasks = subtasks.map(subtask => {
              if (typeof subtask.isEditing === 'boolean') {
                delete subtask.isEditing;
              }
              return subtask;
            });
          }
          if (status === ToDoStatus.COMPLETED) {
            toDo.doneDate = new Date();
          } else if (status === ToDoStatus.ACTIVE || status === ToDoStatus.FOCUSED) {
            delete toDo.doneDate;
          }
          if (toDo.status === ToDoStatus.FOCUSED && status !== ToDoStatus.FOCUSED) {
            toDo = recalculateToDoFocusTime(toDo, false);
          }
          return { ...toDo, ...fieldsToBeUpdated };
        }
        return toDo;
      });

      userContent.markModified('toDos');

      await userContent.save();

      const apiDetailResponse = new ApiDetailResponse(true, 'Updated to-do successfully.', {
        updatedToDo: userContent.toDos.find((toDo: any) => `${toDo._id}` === _id)
      });
      res.status(HTTPStatus.OK).json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateToDoFocusTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id: userId } = req.user;

      let userContent = await UserContentModel.findOne({ userId });

      const { _id } = req.params;
      const { isCountingFocusTime } = req.body;

      userContent.toDos = userContent.toDos.map((toDo: any) => {
        if (`${toDo._id}` === _id) {
          return recalculateToDoFocusTime(toDo, isCountingFocusTime);
        }
        return toDo;
      });

      userContent.markModified('toDos');

      await userContent.save();

      const apiDetailResponse = new ApiDetailResponse(true, 'Updated to-do focus-time successfully.', {
        updatedToDo: userContent.toDos.find((toDo: any) => `${toDo._id}` === _id)
      });
      res.status(HTTPStatus.OK).json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteToDoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id: userId } = req.user;

      let userContent = await UserContentModel.findOne({ userId });

      const { _id } = req.params;

      userContent.toDos = userContent.toDos.filter((toDo: any) => `${toDo._id}` !== `${_id}`);

      userContent.markModified('toDos');

      await userContent.save();

      const apiResponse = new ApiResponse(true, 'Deleted to-do successfully.');
      res.status(HTTPStatus.OK).json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const ToDoControllerRouter = new ToDoController().expressRouter;

export { ToDoControllerRouter as ToDoController };

export default ToDoControllerRouter;
