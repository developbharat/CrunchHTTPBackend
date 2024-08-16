import { ServiceException } from "../common/exceptions";
import { ClientDevice } from "../db/entities/ClientDevice";
import { MiddlewareFn } from "type-graphql";

export const isDeviceAuthenticated = (): MiddlewareFn<IRootContext> => {
  return async ({ context }, next) => {
    // validate auth token
    const auth_token = context.request.headers.get("authorization");
    if (!auth_token || auth_token.length < 10) {
      throw new ServiceException(
        "Please provide auth_token in authorization header to continue.",
        401,
      );
    }

    // check user_account associated with auth token
    const device = await ClientDevice.isAuthTokenValid(auth_token);

    // attach user account on request
    context.client_device = device;
    return next();
  };
};
