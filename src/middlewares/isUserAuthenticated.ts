import { MiddlewareFn } from "type-graphql";
import { ServiceException } from "../common/exceptions";
import { UserAccount } from "../db/entities/UserAccount";

export const isUserAuthenticated = (): MiddlewareFn<IRootContext> => {
  return async ({ context }, next) => {
    // validate auth token
    const auth_token = context.request.headers.get("authorization");
    if (!auth_token || auth_token.length !== 10) {
      throw new ServiceException(
        "Please provide auth_token in authorization header to continue.",
        401,
      );
    }

    // check user_account associated with auth token
    const user_account = await UserAccount.isAuthTokenValid(auth_token);

    // attach user account on request
    context.user_account = user_account;
    return next();
  };
};
