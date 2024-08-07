import { Router } from "express";
import { ServiceResult } from "../common/ServiceResult";
import { HttpTask, HttpTaskMethod } from "../db/entities/HttpTask";
import { isUserAuthenticated } from "../middlewares/isUserAuthenticated";
import { isValid } from "../middlewares/isValid";
import { HttpTaskResponse } from "../db/entities/HttpTaskResponse";
import { isDeviceAuthenticated } from "../middlewares/isDeviceAuthenticated";

export const httpTaskRoutes = (): Router => {
  const requests = Router();

  requests.post(
    "/new",
    isUserAuthenticated(),
    isValid(
      {
        method: { type: "enum", values: Object.values(HttpTaskMethod) },
        path: "string|min:2|max:1000",
        headers: { type: "object", maxProps: 50 },
        data: "string|optional",
        success_status_codes: {
          type: "array",
          items: { type: "number", positive: true, max: 65000, integer: true },
        },
        max_retries: "number|integer|positive|max:25|optional",
        expires_at: { type: "date" },
      },
      "body",
    ),
    async ({ user_account, body }, res) => {
      const http_request = await HttpTask.createNewRequest({
        method: body.method,
        path: body.path,
        headers: body.headers,
        data: body.data,
        success_status_codes: body.success_status_codes,
        max_retries: body.max_retries,
        expires_at: body.expires_at,
        created_by: user_account!.id,
      });
      const result = ServiceResult()
        .setData(http_request)
        .setCode(200)
        .setStatus("HTTP Task created successfully.")
        .build();
      return res.json(result);
    },
  );

  requests.post(
    "/response/:taskId",
    isDeviceAuthenticated(),
    isValid({ taskId: "id" }, "params"),
    isValid(
      {
        headers: "object",
        data: "string|optional",
        status: "string|min:0|max:255",
        status_code: "number|integer|positive",
        is_success: "boolean",
      },
      "body",
    ),
    async ({ client_device, body, params }, res) => {
      const http_request = await HttpTaskResponse.submit({
        headers: body.headers,
        data: body.data,
        status: body.status,
        status_code: body.status_code,
        task_id: params.taskId,
        is_success: body.is_success,
        device_id: client_device!.id,
      });
      const result = ServiceResult()
        .setData(http_request)
        .setCode(200)
        .setStatus("Task Response submitted successfully.")
        .build();
      return res.json(result);
    },
  );

  return requests;
};
