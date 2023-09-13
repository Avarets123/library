import {
  HttpStatus,
  ValidationError as NestValidationError,
} from '@nestjs/common'
import { ValidationError } from '../errors/validation.error'
import { ValidationErrorResponse } from '../errors/validationError.response'
import { ValidationException } from '../errors/validation.exception'

export class NestValidationErrorToValidationErrorMapper {
  constructor(private validationErrors: NestValidationError[]) {}

  get code(): string {
    return 'VALIDATION_EXCEPTION'
  }
  get status(): number {
    return HttpStatus.UNPROCESSABLE_ENTITY
  }

  map() {
    return new ValidationError(this.exceptionResponse, this.status)
  }

  get exceptionResponse(): ValidationErrorResponse {
    const response = new ValidationErrorResponse()
    const exceptions = this.exceptions
    response.code = this.code
    response.status = this.status
    response.messages = exceptions as any

    return response
  }

  get exceptions(): ValidationException[] {
    const results = []
    this.validationErrors.forEach((error) =>
      results.push(...this.mapNestValidationErrorWithChildren(error)),
    )

    return results
  }

  mapNestValidationErrorWithChildren(
    error: NestValidationError,
    parentPath?: string,
  ) {
    const exceptions = []
    const path = this.getValidationExceptionPath(error, parentPath)
    exceptions.push(...this.mapNestValidationError(error, parentPath))

    error.children.forEach((error) =>
      exceptions.push(...this.mapNestValidationErrorWithChildren(error, path)),
    )

    return exceptions
  }

  mapNestValidationError(error: NestValidationError, parentPath?: string) {
    const exceptions = []

    for (const key in error.constraints) {
      const field = this.getValidationExceptionPath(error, parentPath)
      const message = error.constraints[key]
      exceptions.push(new ValidationException(field, key, message))
    }

    return exceptions
  }

  getValidationExceptionPath(
    error: NestValidationError,
    parentPath?: string,
  ): string {
    return parentPath ? `${parentPath}.${error.property}` : error.property
  }
}
