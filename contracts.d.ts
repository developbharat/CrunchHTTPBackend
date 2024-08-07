import { ClientDevice } from "./src/db/entities/ClientDevice";
import { UserAccount } from "./src/db/entities/UserAccount";

declare global {
  namespace Express {
    export interface Request {
      user_account?: UserAccount;
      client_device?: ClientDevice;
    }
  }
}
