type ISuccessResult<TData> = {
  success: true;
  code: number;
  status: string;
  data: TData;
};
type IFailureResult = { success: false; code: number; status: string };

class _ServiceResult<TSuccessData = unknown> {
  private data: TSuccessData | null = null;
  private code: number = 200;
  private status: string = "Request completed successfully.";
  private shouldRespondPositive: Boolean = true;

  setData<TData extends TSuccessData>(data: TData | null = null): _ServiceResult<TData> {
    this.data = data;
    this.shouldRespondPositive = true;
    return this as any;
  }

  setCode(code: number): _ServiceResult<TSuccessData> {
    this.code = code;
    return this;
  }

  setStatus(status: string): _ServiceResult<TSuccessData> {
    this.status = status;
    return this;
  }

  setException(content: string, code: number = 400): _ServiceResult<TSuccessData> {
    this.status = content;
    this.code = code;
    this.shouldRespondPositive = false;
    return this;
  }

  build(): ISuccessResult<TSuccessData | null> | IFailureResult {
    if (this.shouldRespondPositive) {
      return {
        success: true,
        data: this.data,
        code: this.code,
        status: this.status,
      };
    } else {
      return { success: false, code: this.code, status: this.status };
    }
  }
}

export type IServiceResult<T = any> = ISuccessResult<T | null> | IFailureResult;

export const ServiceResult = () => new _ServiceResult();
