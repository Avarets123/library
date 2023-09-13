import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionsFilter extends BaseExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    console.error(exception.message)

    const response = host.switchToHttp().getResponse<Response>()
    const message = exception.message.replace('/\n/g', '')

    response.status(500).json({
      status: 500,
      code: exception.code,
      message,
      meta: exception.meta,
    })
  }
}
