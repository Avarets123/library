import { AutoMap } from '@automapper/classes'
import { User, UserRolesEnum } from '@prisma/client'
import { BookModel } from './book.model'

export class UserModel implements User {
  @AutoMap()
  id: string

  @AutoMap()
  role: UserRolesEnum

  @AutoMap()
  email: string

  @AutoMap()
  name: string

  @AutoMap()
  password: string

  books: { book: BookModel }[]

  @AutoMap()
  birthDate: Date
}
