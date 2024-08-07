import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";
import { env } from "../common/env";
import { ClientDevice } from "./entities/ClientDevice";
import { HttpRequest } from "./entities/HttpRequest";
import { HttpResponse } from "./entities/HttpResponse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MainDataSource = new DataSource({
  type: "postgres",
  url: env.dbUrl,
  synchronize: true,
  logging: true,
  // entities: [path.join(__dirname, "entities", "*.{js,ts}")],
  entities: [ClientDevice, HttpRequest, HttpResponse],
  migrations: [path.join(__dirname, "migrations/*.{js,ts}")],
  subscribers: [],
});
