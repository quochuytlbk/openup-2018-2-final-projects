import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

import { ApiErrorResponse } from '../../payload/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        let apiErrorResponse;
        if (info) {
          apiErrorResponse = new ApiErrorResponse(false, 'Your access is unauthorized.', {
            authToken: info.message
          });
        } else {
          apiErrorResponse = new ApiErrorResponse(false, 'Your access is unauthorized.', {
            authToken: 'Invalid auth token.'
          });
        }
        return res.status(HTTPStatus.UNAUTHORIZED).json(apiErrorResponse);
      }

      req.user = {
        _id: user._id,
        email: user.email
      };

      next();
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

export { authHandler };

export default authHandler;
