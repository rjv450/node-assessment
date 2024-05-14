import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let errorResponseObject: object;
    let status: number;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      console.log(exception.message);
      status = exception.getStatus();
      errorResponseObject = {
        message: exception.getResponse()['message'],
        stausCode: exception.getResponse()['statusCode'],
      };
    } else if (exception instanceof Error) {
      console.log(exception);
      status = 500;
      errorResponseObject = {
        message: 'Unknown error: ' + exception.message,
        stausCode: 1,
      };
    }
    response.status(status).json(errorResponseObject);
  }
}
