import { Router } from "express";
import { ServiceResult } from "../common/ServiceResult";
import { UserAccount } from "../db/entities/UserAccount";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isValid } from "../middlewares/isValid";

export const accountRoutes = (): Router => {
  const accounts = Router();

  accounts.get("/whoami", isAuthenticated(), ({ user_account }, res) => {
    const result = ServiceResult()
      .setData(user_account!.clean())
      .setCode(200)
      .setStatus("Device details fetched successfully.")
      .build();
    return res.json(result);
  });

  accounts.post(
    "/signup",
    isValid(
      { name: "string|min:4|max:40", email: "email", password: "string|min:6|max:10" },
      "body",
    ),
    async ({ body }, res) => {
      const account = await UserAccount.signUp({
        name: body.name,
        email: body.email,
        password: body.password,
      });
      const result = ServiceResult()
        .setData(account.clean())
        .setCode(200)
        .setStatus("UserAccount created successfully.")
        .build();
      return res.json(result);
    },
  );

  accounts.post(
    "/signin",
    isValid({ email: "email", password: "string|min:6|max:10" }, "body"),
    async ({ body }, res) => {
      const account = await UserAccount.signIn({
        email: body.email,
        password: body.password,
      });
      const result = ServiceResult()
        .setData(account.clean())
        .setCode(200)
        .setStatus("UserAccount details verified successfully.")
        .build();
      return res.json(result);
    },
  );

  return accounts;
};
