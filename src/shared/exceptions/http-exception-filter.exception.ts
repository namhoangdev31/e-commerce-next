import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const exceptionResponse = exception.getResponse()

    response.status(status).json({
      statusCode: status,
      message: exceptionResponse['message'] || exception.message,
      error: exceptionResponse['error'] || null,
    })
  }
}
