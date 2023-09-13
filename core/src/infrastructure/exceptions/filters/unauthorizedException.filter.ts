import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response
      .status(HttpStatus.UNAUTHORIZED)
      .json({ code: 'UNAUTHORIZED_EXCEPTION', status: HttpStatus.UNAUTHORIZED })
  }
}
