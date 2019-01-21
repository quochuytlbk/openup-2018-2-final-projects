import { UserModel } from '../models/User';
import { UserContentModel } from '../models/UserContent';

const registerUserWithGoogle = async profile => {
  const name = profile.displayName;
  const googleId = profile.id;
  const email = profile.emails[0].value;

  let foundUser = await UserModel.findOne({ email });
  if (foundUser) {
    foundUser.googleId = googleId;
    foundUser.name = name;
    await foundUser.save();

    return foundUser;
  } else {
    let newUser = new UserModel({
      name,
      email,
      googleId
    });

    await newUser.save();

    const newUserContent = new UserContentModel({
      userId: newUser._id,
      toDos: []
    });

    await newUserContent.save();

    return newUser;
  }
};

export { registerUserWithGoogle };
