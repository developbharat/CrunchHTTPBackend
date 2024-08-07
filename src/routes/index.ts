import { deviceRoutes } from "./devices";
import { Router } from "express";

export const apiRoutes = (): Router => {
  const routes = Router();

  routes.use("/devices", deviceRoutes());

  return routes;
};
