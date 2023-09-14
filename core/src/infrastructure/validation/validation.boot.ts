import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import { NestValidationErrorToValidationErrorMapper } from './mappers/nesValidationErrorToValidationError.mapper'

export function validationBoot(app: INestApplication) {
  const validationException = new ValidationPipe({
    errorHttpStatusCode: 422,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new NestValidationErrorToValidationErrorMapper(
        validationErrors,
      ).map()
    },
    whitelist: true,
    transform: true,
  })

  console.log(validationException)

  app.useGlobalPipes(validationException)
}
