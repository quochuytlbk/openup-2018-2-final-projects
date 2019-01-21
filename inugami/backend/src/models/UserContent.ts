import mongoose from 'mongoose';
import { prop, Typegoose } from 'typegoose';

import { ModelName } from '../enums/ModelNameEnum';

import { ToDo } from './ToDo';

class UserContent extends Typegoose {
  @prop({ required: [true, 'User id is required.'] })
  public userId: string;

  @prop()
  public toDos?: ToDo[];
}

const UserContentModel = new UserContent().getModelForClass(UserContent, {
  existingMongoose: mongoose
});

if (UserContent.name !== ModelName.USER_CONTENT) {
  throw new Error(`Typegoose Model Class name doesn't match that of ModelName enums.`);
}

export { UserContent, UserContentModel };

export default UserContentModel;
