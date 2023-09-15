import { BookCreateDto } from '@modules/books/dto/bookCreate.dto'

export const bookValidData: BookCreateDto = {
  authorsIds: undefined,
  genres: undefined,
  name: 'testing book',
  publishedDate: new Date(),
  redaction: 'test redaction',
}
