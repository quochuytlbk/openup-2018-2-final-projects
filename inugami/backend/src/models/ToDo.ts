import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { Category } from '../enums/CategoryEnum';
import { Effort } from '../enums/EffortEnum';
import { ToDoStatus } from '../enums/ToDoStatusEnum';

class Subtask {
  @prop({ required: [true, 'Subtask name is required.'] })
  public name: string;

  @prop({ enum: ToDoStatus, required: [true, 'Subtask status is required.'] })
  public status: ToDoStatus;
}

class ToDo extends Typegoose {
  @prop({ required: [true, 'To-do name is required.'] })
  public name: string;

  @prop({ enum: Effort })
  public effort?: Effort;

  @prop()
  public dueDate?: Date;

  @prop()
  public doneDate?: Date;

  @prop()
  public notes?: string;

  @prop({ enum: ToDoStatus, required: [true, 'To-do status is required.'] })
  public status: ToDoStatus;

  @prop({ enum: Category, required: [true, 'To-do category is required.'] })
  public category: Category;

  @prop({ _id: false })
  public subtasks?: Subtask[];

  @prop()
  public elapsedTime?: number;

  @prop()
  public lastTime?: Date;

  @prop()
  public isCountingFocusTime: boolean;
}

const ToDoModel = new ToDo().getModelForClass(ToDo, {
  existingMongoose: mongoose
});

export { ToDo, ToDoModel };
