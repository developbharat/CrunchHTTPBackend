import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { HttpTask } from "../../db/entities/HttpTask";
import { CreateHttpTaskInput, ListUserAccountTasksInput } from "./dto";
import { isUserAuthenticated } from "../../middlewares/isUserAuthenticated";
import { IsNull, MoreThan } from "typeorm";
import { isDeviceAuthenticated } from "../../middlewares/isDeviceAuthenticated";
import { HttpTaskStatus } from "../../db/enums/HttpTaskStatus";

@Resolver()
export class HttpTaskResolver {
  @UseMiddleware(isUserAuthenticated())
  @Mutation(() => HttpTask)
  public async createNewHttpTask(
    @Ctx() { user_account }: IRootContext,
    @Arg("data") data: CreateHttpTaskInput,
  ): Promise<HttpTask> {
    return await HttpTask.createNewRequest({
      path: data.path,
      method: data.method,
      data: data.data,
      user_account_id: user_account!!.id,
      expires_at: data.expires_at,
      headers: JSON.parse(data.headers),
      max_retries: data.max_retries,
      success_status_codes: data.success_status_codes,
    });
  }

  @UseMiddleware(isUserAuthenticated())
  @Query(() => [HttpTask], {
    description: "Allows an authenticated user to list http tasks associated with his account.",
  })
  public async listUserAccountTasks(
    @Ctx() { user_account }: IRootContext,
    @Arg("data") data: ListUserAccountTasksInput,
  ): Promise<HttpTask[]> {
    return await HttpTask.find({
      where: {
        user_account_id: user_account!!.id,
        id: data.latest_task_id ? MoreThan(data.latest_task_id) : undefined,
      },
      take: data.limit,
    });
  }

  @UseMiddleware(isDeviceAuthenticated())
  @Query(() => [HttpTask], {
    description: "Allows an authenticated device to list http tasks to work with.",
  })
  public async listClientDeviceTasks(@Ctx() { client_device }: IRootContext): Promise<HttpTask[]> {
    const oldTasksCount = await HttpTask.count({
      where: {
        device_id: client_device?.id,
        status: HttpTaskStatus.IN_PROGRESS,
      },
      take: 1000,
    });

    // return blank array incase device has 1000 already pending tasks.
    if (oldTasksCount == 1000) return [];

    // Assign 1000 tasks to this current device
    await HttpTask.update(
      { status: HttpTaskStatus.CREATED, device_id: IsNull() },
      { device_id: client_device!!.id },
    );

    // Return tasks allocated to provided device.
    return await HttpTask.find({
      where: {
        device_id: client_device!!.id,
        status: HttpTaskStatus.CREATED,
      },
      take: 1000,
    });
  }
}
