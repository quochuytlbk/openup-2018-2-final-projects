import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../../payload/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (Object.keys(err).length === 0) {
    err = {
      unhandledError: `${err}`
    };
  }
  const apiErrorResponse = new ApiErrorResponse(false, 'Some unhandled error occured on the backend side.', err);
  return res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
};

export { defaultErrorHandler };

export default defaultErrorHandler;
