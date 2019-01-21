import express, { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { UserModel } from '../models/User';
import { UserContentModel } from '../models/UserContent';

import { validateLoginRequest } from '../helpers/validators/loginRequestValidator';
import { keys } from '../config/keys';
import { ILoginRequest } from '../payload/request/ILoginRequest';
import { ApiDetailResponse } from '../payload/response/ApiDetailResponse';
import { ApiErrorResponse } from '../payload/response/ApiErrorResponse';
import { HTTPStatus } from '../enums/HTTPStatusEnum';
import { ApiResponse } from '../payload/response/ApiResponse';

class AuthController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.post('/login', validateLoginRequest, this.loginUser);
    this.expressRouter.post('/register', this.registerUser);
    this.expressRouter.get('/google', this.authenticateWithGoogle);
    this.expressRouter.get('/google/callback', passport.authenticate('google'), this.authenticateWithGoogleCallback);
    this.expressRouter.get('/current', passport.authenticate('jwt', { session: false }), this.getCurrentUser);
  };

  private loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ILoginRequest = req.body;

    const { email, password } = reqBody;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        const errors = {
          email: 'Email not found.'
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'User not found.', errors);
        return res.status(HTTPStatus.NOT_FOUND).send(apiErrorResponse);
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password);

      if (doesPasswordMatch) {
        const { _id } = user;
        let name = '';

        const jwtPayload = {
          _id,
          email,
          name
        };

        const authToken = await jwt.sign(jwtPayload, keys.secretOrKey, { expiresIn: 86400 });

        const details = {
          authToken
        };
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully logged in.', details);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          password: 'Password incorrect.'
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Login request failed.', errors);
        return res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const foundUser = await UserModel.findOne({ email: req.body.email });
      if (foundUser) {
        const errors = {
          email: 'Email is already taken.'
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Register request failed.', errors);
        return res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }

      const newUser = new UserModel({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.password, salt);

      newUser.password = hash;

      await newUser.save();

      const newUserContent = new UserContentModel({
        userId: newUser._id,
        toDos: []
      });

      await newUserContent.save();

      const jwtPayload = {
        _id: newUser._id,
        email,
        name
      };

      const authToken = await jwt.sign(jwtPayload, keys.secretOrKey, { expiresIn: 86400 });

      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully registered.', { authToken });
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private authenticateWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  };

  private authenticateWithGoogleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwtPayload = {
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        googleId: req.user.googleId
      };

      const authToken = await jwt.sign(jwtPayload, keys.secretOrKey, { expiresIn: 86400 });

      return res.render('oauth-response', { authToken });
    } catch (err) {
      next(err);
    }
  };

  private getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  };
}

const AuthControllerRouter = new AuthController().expressRouter;

export { AuthControllerRouter as AuthController };

export default AuthControllerRouter;
