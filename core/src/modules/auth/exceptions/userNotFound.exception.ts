import { HttpStatus, NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Пользователь не найден!',
      code: 'USER_NOT_FOUND_EXCEPTION',
      status: HttpStatus.NOT_FOUND,
    })
  }
}
