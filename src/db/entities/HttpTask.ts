import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { CustomRelIDColumn } from "../columns/CustomRelIDColumn";

export enum HttpTaskMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum HttpTaskStatus {
  CREATED = "CREATED",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
}

@Entity({ name: "http_tasks" })
export class HttpTask extends BaseEntity {
  @CustomIDColumn()
  id: string;

  @Column({ name: "method", type: "enum", enum: HttpTaskMethod, nullable: false })
  method: HttpTaskMethod;

  @Column({ name: "path", length: 1000, nullable: false })
  path: string;

  @Column({ name: "headers", type: "jsonb", default: {}, nullable: false })
  headers: Record<string, string>;

  @Column({ name: "data", type: "text", nullable: true })
  data: string | null;

  /**
   * Data to check http request state: (Success, Failed, Should Retry)
   */
  @Column("integer", {
    name: "success_status_codes",
    array: true,
    default: [200],
    nullable: false,
  })
  success_status_codes: number[];

  @Column({ name: "max_retries", type: "integer", default: 5, nullable: false })
  max_retries: number;

  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expires_at: Date | null;

  @Column({
    name: "status",
    type: "enum",
    enum: HttpTaskStatus,
    default: HttpTaskStatus.CREATED,
  })
  status: HttpTaskStatus;

  @CustomRelIDColumn({ name: "created_by" })
  created_by: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public clean(): HttpTask {
    return {
      id: this.id,
      method: this.method,
      path: this.path,
      headers: this.headers,
      data: this.data,
    } as HttpTask;
  }

  public static async createNewRequest(
    data: Pick<
      HttpTask,
      | "method"
      | "path"
      | "headers"
      | "data"
      | "success_status_codes"
      | "max_retries"
      | "expires_at"
      | "created_by"
    >,
  ): Promise<HttpTask> {
    const request = await this.create({
      method: data.method,
      path: data.path,
      headers: data.headers,
      success_status_codes: data.success_status_codes,
      max_retries: data.max_retries,
      expires_at: data.expires_at,
    }).save();

    return request.clean();
  }
}
