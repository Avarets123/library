export class ValidationException extends Error {
  constructor(
    readonly field: string,
    readonly rule: string,
    readonly message: string,
    readonly code = 'VALIDATION_EXCEPTION',
  ) {
    super()
  }
}
