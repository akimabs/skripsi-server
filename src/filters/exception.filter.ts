import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VALIDATION_ERROR } from './validation.constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { response, message } = exception as any;

    if (response?.message && Array.isArray(response.message)) {
      response.error = response.message.map((msg: string) => {
        const err = {
          field: '',
          validate: [],
        };
        msg.split(' ').forEach((val: string, index: number) => {
          if (index === 0) {
            err.field = val;
          } else {
            err.validate.push(val);
          }
        });

        return {
          message: err.validate.join(' '),
          field: err.field,
        };
      });
      response.message = VALIDATION_ERROR;
    }

    res.status(status).json({
      code: status,
      success: false,
      message: response?.message || message,
      error: response?.error || [],
    });
  }
}
