import { Field, ID, InputType } from "type-graphql";
import { DeviceType } from "../../db/enums/DeviceType";

@InputType()
export class AddNewDeviceInput {
  @Field(() => String)
  name: string;

  @Field(() => ID)
  device_id: string;

  @Field(() => DeviceType)
  device_type: DeviceType;
}

@InputType()
export class BlockDeviceInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  reason: string;
}

@InputType()
export class UnBlockDeviceInput {
  @Field(() => ID)
  id: string;
}
