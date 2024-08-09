import { registerEnumType } from "type-graphql";

export enum DeviceType {
  ANDROID = "ANDROID",
  DESKTOP = "DESKTOP",
  TEMP_DEVICE = "TEMP_DEVICE",
}

registerEnumType(DeviceType, {
  name: "DeviceType",
});
