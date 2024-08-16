import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { CustomRelIDColumn } from "../columns/CustomRelIDColumn";
import { HttpTask } from "./HttpTask";
import { ServiceException } from "../../common/exceptions";

@Entity({ name: "http_task_responses" })
export class HttpTaskResponse extends BaseEntity {
  @CustomIDColumn()
  id: string;

  @Column({ name: "headers", type: "jsonb", default: {}, nullable: false })
  headers: string;

  @Column({ name: "data", type: "text", nullable: true })
  data: string | null;

  @Column({ name: "status", type: "text", default: "", nullable: false })
  status: string;

  @Column({ name: "status_code", type: "integer", nullable: false })
  status_code: number;

  @Column({ name: "is_success", type: "boolean", nullable: false })
  is_success: boolean;

  @CustomRelIDColumn({ name: "task_id" })
  task_id: string;

  @CustomRelIDColumn({ name: "device_id" })
  device_id: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public clean(): HttpTaskResponse {
    return {
      id: this.id,
      headers: this.headers,
      data: this.data,
      status: this.status,
      status_code: this.status_code,
      is_success: this.is_success,
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as HttpTaskResponse;
  }

  public static async submit(
    data: Pick<
      HttpTaskResponse,
      "headers" | "data" | "status" | "status_code" | "is_success" | "task_id" | "device_id"
    >,
  ): Promise<void> {
    // check if HttpTask exists with provided id
    // TODO: optimise it, as 1000s of workers will be submitting data in realtime.
    // Possible Optimisation: add foreign key constraint and if it fails we know thats an issue.
    const exists = await HttpTask.findOne({
      where: { id: data.task_id },
      select: { id: true },
    });
    if (!exists) throw new ServiceException("Invalid HTTPTask ID Provided.", 400);

    await this.insert({
      headers: data.headers,
      data: data.data,
      status: data.status,
      status_code: data.status_code,
      is_success: data.is_success,
      task_id: data.task_id,
      device_id: data.device_id,
    });

    return;
  }
}
