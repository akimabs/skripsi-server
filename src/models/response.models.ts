export class Response<T = any> {
  message: string;

  code: number;

  success: boolean;

  data?: T;

  constructor(message: string, code: number, data?: T) {
    this.code = code;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
