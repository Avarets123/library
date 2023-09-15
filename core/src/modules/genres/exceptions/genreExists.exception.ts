import { BadRequestException, HttpStatus } from '@nestjs/common'

export class GenreExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Жанр с таким названием уже создан!',
      code: 'GENRE_EXISTS_EXCEPTION',
      status: HttpStatus.BAD_REQUEST,
    })
  }
}
