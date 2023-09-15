import { BadRequestException, HttpStatus } from '@nestjs/common'

export class BookExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Книга с таким названием уже зарегистрирована!',
      code: 'BOOK_EXISTS_EXCEPTION',
      status: HttpStatus.BAD_REQUEST,
    })
  }
}
