import { accountRoutes } from "./accounts";
import { deviceRoutes } from "./devices";
import { Router } from "express";
import { httpTaskRoutes } from "./http-tasks";

export const apiRoutes = (): Router => {
  const routes = Router();

  routes.use("/devices", deviceRoutes());
  routes.use("/accounts", accountRoutes());
  routes.use("/tasks", httpTaskRoutes());

  return routes;
};
