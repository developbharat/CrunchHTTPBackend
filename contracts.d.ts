import { YogaInitialContext } from "graphql-yoga";
import { UserAccount } from "./src/db/entities/UserAccount";
import { ClientDevice } from "./src/db/entities/ClientDevice";

declare global {
  export interface IRootContext extends YogaInitialContext {
    user_account?: UserAccount;
    client_device?: ClientDevice;
  }
}
