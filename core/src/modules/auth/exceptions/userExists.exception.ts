import { BadRequestException, HttpStatus } from '@nestjs/common'

export class UserExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Пользователь с таким email уже зарегистрирован!',
      code: 'USER_EXISTS_EXCEPTION',
      status: HttpStatus.BAD_REQUEST,
    })
  }
}
