import { INestApplication } from '@nestjs/common'
import { AllExceptionsFilter } from './filters/allExceptions.filter'
import { PrismaExceptionsFilter } from './filters/prismaExceptions.filter'

export function exceptionBoot(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalFilters(new PrismaExceptionsFilter())
}
