import { Router } from "express";
import { ServiceResult } from "../common/ServiceResult";
import { isDeviceAuthenticated } from "../middlewares/isDeviceAuthenticated";

export const deviceRoutes = (): Router => {
  const devices = Router();

  devices.get("/whoami", isDeviceAuthenticated(), ({ client_device }, res) => {
    const result = ServiceResult()
      .setData(client_device.clean())
      .setCode(200)
      .setStatus("Device details fetched successfully.")
      .build();
    return res.json(result);
  });

  return devices;
};
