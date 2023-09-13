import { ValidationException } from './validation.exception'

export class ValidationErrorResponse {
  status: number
  code: string
  messages: string[]
  exceptions: ValidationException[]
}
