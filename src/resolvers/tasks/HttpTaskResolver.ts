import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { HttpTask } from "../../db/entities/HttpTask";
import { CreateHttpTaskInput } from "./dto";
import { isUserAuthenticated } from "../../middlewares/isUserAuthenticated";

@Resolver()
export class HttpTaskResolver {
  @UseMiddleware(isUserAuthenticated())
  @Mutation(() => HttpTask)
  public async createNewHttpTask(
    @Ctx() { client_device }: IRootContext,
    @Arg("data") data: CreateHttpTaskInput,
  ): Promise<HttpTask> {
    return await HttpTask.createNewRequest({
      path: data.path,
      method: data.method,
      data: data.data,
      device_id: client_device!!.id,
      expires_at: data.expires_at,
      headers: JSON.parse(data.headers),
      max_retries: data.max_retries,
      success_status_codes: data.success_status_codes,
    });
  }
}
