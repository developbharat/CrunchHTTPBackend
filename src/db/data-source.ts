import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";
import { env } from "../common/env";
import { ClientDevice } from "./entities/ClientDevice";
import { HttpTask } from "./entities/HttpTask";
import { HttpTaskResponse } from "./entities/HttpTaskResponse";
import { UserAccount } from "./entities/UserAccount";
import { MappedCache } from "./cache";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MainDataSource = new DataSource({
  type: "postgres",
  url: env.dbUrl,
  synchronize: !env.isProduction,
  logging: true,
  // entities: [path.join(__dirname, "entities", "*.{js,ts}")],
  entities: [UserAccount, ClientDevice, HttpTask, HttpTaskResponse],
  migrations: [path.join(__dirname, "migrations/*.{js,ts}")],
  subscribers: [],
  cache: {
    provider: () => new MappedCache(),
  },
});
