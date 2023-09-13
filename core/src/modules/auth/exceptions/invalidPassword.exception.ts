import { BadRequestException, HttpStatus } from '@nestjs/common'

export class InvalidPasswordException extends BadRequestException {
  constructor() {
    super({
      message: 'Неверный пароль!',
      code: 'INVALID_PASSWORD_EXCEPTION',
      status: HttpStatus.BAD_REQUEST,
    })
  }
}
