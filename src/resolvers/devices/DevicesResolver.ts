import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { ClientDevice } from "../../db/entities/ClientDevice";
import { isDeviceAuthenticated } from "../../middlewares/isDeviceAuthenticated";
import { isUserAuthenticated } from "../../middlewares/isUserAuthenticated";
import {
  AddNewDeviceInput,
  BlockDeviceInput,
  SetDeviceBatchSizeInput,
  UnBlockDeviceInput,
} from "./dto";
import { MainDataSource } from "../../db/data-source";

@Resolver()
export class DevicesResolver {
  @UseMiddleware(isDeviceAuthenticated())
  @Query(() => ClientDevice, { name: "isDeviceAuthenticated", nullable: true })
  async isDeviceAuthenticated(@Ctx() { client_device }: IRootContext): Promise<ClientDevice> {
    return client_device!!;
  }

  @UseMiddleware(isUserAuthenticated())
  @Query(() => [ClientDevice])
  async listUserAccountDevices(@Ctx() { user_account }: IRootContext): Promise<ClientDevice[]> {
    return await ClientDevice.find({ where: { user_account_id: user_account!!.id } });
  }

  @UseMiddleware(isUserAuthenticated())
  @Mutation(() => ClientDevice)
  async addNewDevice(
    @Ctx() { user_account }: IRootContext,
    @Arg("data") data: AddNewDeviceInput,
  ): Promise<ClientDevice> {
    // clear cached device to reload updated batch_size
    await MainDataSource.queryResultCache?.remove([data.device_id]);

    return await ClientDevice.addNewDevice({
      name: data.name,
      device_id: data.device_id,
      device_type: data.device_type,
      user_account_id: user_account!!.id,
    });
  }

  @UseMiddleware(isUserAuthenticated())
  @Mutation(() => ClientDevice)
  async blockDevice(
    @Ctx() { user_account }: IRootContext,
    @Arg("data") data: BlockDeviceInput,
  ): Promise<ClientDevice> {
    return await ClientDevice.block({
      id: data.id,
      blocked_status: data.reason,
      user_account_id: user_account!!.id,
    });
  }

  @UseMiddleware(isUserAuthenticated())
  @Mutation(() => ClientDevice)
  async unBlockDevice(
    @Ctx() { user_account }: IRootContext,
    @Arg("data") data: UnBlockDeviceInput,
  ): Promise<ClientDevice> {
    return await ClientDevice.unblock({ id: data.id, user_account_id: user_account!!.id });
  }

  @UseMiddleware(isDeviceAuthenticated())
  @Mutation(() => ClientDevice, {
    description: "Allows an authenticated device to update its own batch size.",
  })
  async setDeviceBatchSize(
    @Ctx() { client_device }: IRootContext,
    @Arg("data") data: SetDeviceBatchSizeInput,
  ): Promise<ClientDevice> {
    // clear cached device to reload updated batch_size
    await MainDataSource.queryResultCache?.remove([client_device!!.id]);

    // update batch_size for current device.
    return await ClientDevice.save({ id: client_device!!.id, batch_size: data.batch_size });
  }
}
