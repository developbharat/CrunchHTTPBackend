import { createYoga } from "graphql-yoga";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { env } from "./common/env";
import { connect_db } from "./db/init";
import { UserAccountResolver } from "./resolvers/accounts/UserAccountResolver";
import { DevicesResolver } from "./resolvers/devices/DevicesResolver";
import { HttpTaskResolver } from "./resolvers/tasks/HttpTaskResolver";
import path from "path";
import { HttpTask } from "./db/entities/HttpTask";

// Set serialization for date to iso string always
Date.prototype.toJSON = function() {
  return this.getTime() as unknown as string;
};

export const main = async (): Promise<void> => {
  await connect_db();

  // configure and add graphql server as middleware
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [UserAccountResolver, DevicesResolver, HttpTaskResolver],
    }),
    graphiql: {
      credentials: "include",
      title: "Crunch HTTP GraphiQL",
      defaultQuery: await Bun.file(path.join(import.meta.dirname, "playground.graphql")).text(),
    },
    graphqlEndpoint: "/graphql",
    maskedErrors: env.isProduction,
    landingPage: false,
  });

  Bun.serve({ fetch: yoga, hostname: env.host, port: env.port });
  console.log(`Server started at: http://${env.host}:${env.port}`);

  // Reset device_id from tasks which were not completed within 15minutes from updated_at
  setInterval(async () => {
    await HttpTask.resetFrozenTasksFromMinutes(15);
  }, 15 * 1000); // Every 15 seconds 
};

main().catch(console.error);
