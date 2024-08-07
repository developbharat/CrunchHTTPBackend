import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { CustomIDColumn } from "../columns/CustomIDColumn";

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum HttpRequestStatus {
  CREATED = "CREATED",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
}

@Entity({ name: "http_requests" })
export class HttpRequest extends BaseEntity {
  @CustomIDColumn()
  id: string;

  @Column({ name: "method", type: "enum", enum: RequestMethod, nullable: false })
  method: RequestMethod;

  @Column({ name: "path", length: 1000, nullable: false })
  path: string;

  @Column({ name: "headers", type: "jsonb", default: {}, nullable: false })
  headers: string;

  @Column({ name: "data", type: "jsonb", nullable: true })
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
    enum: HttpRequestStatus,
    default: HttpRequestStatus.CREATED,
  })
  status: HttpRequestStatus;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public clean(): HttpRequest {
    return {
      id: this.id,
      method: this.method,
      path: this.path,
      headers: this.headers,
      data: this.data,
    } as HttpRequest;
  }
}
