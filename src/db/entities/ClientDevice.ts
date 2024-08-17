import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { ServiceException } from "../../common/exceptions";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { CustomRelIDColumn } from "../columns/CustomRelIDColumn";
import { DeviceType } from "../enums/DeviceType";

@ObjectType()
@Entity({ name: "client_devices" })
export class ClientDevice extends BaseEntity {
  @Field(() => ID)
  @CustomIDColumn()
  id: string;

  @Field(() => String)
  @Column({ name: "name", length: 255, nullable: false, default: "" })
  name: string;

  @Field(() => String)
  @Column({ name: "device_id", length: 30, nullable: false, unique: true })
  device_id: string;

  @Column({ name: "batch_size", type: "integer", nullable: false, default: 1000 })
  batch_size: number;

  @Column({ name: "blocked_at", type: "timestamp", nullable: true })
  blocked_at: Date | null;

  @Column({ name: "blocked_status", type: "text", nullable: true })
  blocked_status: string | null;

  @Field(() => DeviceType)
  @Column({
    name: "device_type",
    type: "enum",
    enum: DeviceType,
    default: DeviceType.TEMP_DEVICE,
  })
  device_type: DeviceType;

  @CustomRelIDColumn({ name: "user_account_id" })
  user_account_id: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public static async isAuthTokenValid(auth_token: string): Promise<ClientDevice> {
    const device = await this.findOne({
      where: { device_id: auth_token },
      cache: { id: auth_token, milliseconds: 15 * 60_000 },
    }); // cache for 5 minute
    if (!device) throw new ServiceException("Invalid Authorization token provided. ", 400);

    if (device.blocked_at !== null)
      throw new ServiceException(`Device is blocked due to: ${device.blocked_status}`);

    return device;
  }

  public static async addNewDevice(
    data: Pick<ClientDevice, "name" | "device_id" | "device_type" | "user_account_id">,
  ): Promise<ClientDevice> {
    return await this.create({
      name: data.name,
      device_id: data.device_id,
      device_type: data.device_type,
      user_account_id: data.user_account_id,
    }).save();
  }

  public static async unblock(
    data: Pick<ClientDevice, "id" | "user_account_id">,
  ): Promise<ClientDevice> {
    // Check if device exists with provided id
    const exists = await this.findOne({
      where: { id: data.id, user_account_id: data.user_account_id },
      select: { id: true },
    });
    if (!exists) throw new ServiceException("Device with provided id doesn't exist", 400);

    // Update device with provided id
    return await this.save({ id: data.id, blocked_at: null, blocked_status: null });
  }

  public static async block(
    data: Pick<ClientDevice, "id" | "blocked_status" | "user_account_id">,
  ): Promise<ClientDevice> {
    // Check if device exists with provided id
    const exists = await this.findOne({
      where: { id: data.id, user_account_id: data.user_account_id },
      select: { id: true },
    });
    if (!exists) throw new ServiceException("Device with provided id doesn't exist", 400);

    return await this.save({
      id: data.id,
      blocked_at: new Date(),
      blocked_status: data.blocked_status,
    });
  }
}
