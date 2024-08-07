import { NextFunction, Request, Response } from "express";
import { ServiceException } from "../common/exceptions";
import { ClientDevice } from "../db/entities/ClientDevice";

export const isDeviceAuthenticated = () => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // validate auth token
    const auth_token = req.headers["authorization"];
    if (!auth_token || auth_token.length !== 10) {
      throw new ServiceException(
        "Please provide auth_token in authorization header to continue.",
        401,
      );
    }

    // check user_account associated with auth token
    const device = await ClientDevice.isAuthTokenValid(auth_token, false);

    // attach user account on request
    req.client_device = device;
    return next();
  };
};
