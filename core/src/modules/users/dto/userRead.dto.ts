import { AutoMap } from '@automapper/classes'
import { BookModel } from '@infrastructure/database/models/book.model'
import { BookReadDto } from '@modules/books/dto/bookRead.dto'
import { UserRolesEnum } from '@prisma/client'

export class UserReadDto {
  @AutoMap()
  id: string

  @AutoMap()
  role: UserRolesEnum

  @AutoMap()
  email: string

  @AutoMap()
  name: string

  books: BookReadDto[]

  @AutoMap()
  birthDate: Date
}
