import { BadRequestException, HttpStatus } from '@nestjs/common'

export class PasswordUndefinedException extends BadRequestException {
  constructor() {
    super({
      message: 'Пароль не задан!',
      code: 'INVALID_PASSWORD_EXCEPTION',
      status: HttpStatus.BAD_REQUEST,
    })
  }
}
