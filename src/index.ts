import express, { NextFunction, Request, Response } from "express";
import { env } from "./common/env";
import { connect_db } from "./db/init";
import { apiRoutes } from "./routes";
import { ServiceException } from "./common/exceptions";
import { ServiceResult } from "./common/ServiceResult";

// Set serialization for date to iso string always
Date.prototype.toJSON = function () {
  return this.getTime() as unknown as string;
};

export const main = async (): Promise<void> => {
  await connect_db();

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    console.log(`Request received at: ${req.originalUrl}`);
    return next();
  });

  // setup api routes
  app.use("/api", apiRoutes());

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ServiceException) {
      return res.json(ServiceResult().setException(err.message, err.code).build());
    }

    return res.json(ServiceResult().setException(err.message, 400).build());
  });

  app.listen(env.port, env.host, () => {
    console.log(`Server started at: http://${env.host}:${env.port}`);
  });
};

main().catch(console.error);
