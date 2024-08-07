import { ClientDevice } from "./src/db/entities/ClientDevice";

declare global {
  namespace Express {
    export interface Request {
      client_device: ClientDevice;
    }
  }
}
