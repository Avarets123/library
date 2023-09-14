import { AutoMap } from '@automapper/classes'
import { Book } from '@prisma/client'
import { UserModel } from './user.model'

export class BookModel implements Book {
  @AutoMap()
  id: string

  @AutoMap()
  name: string

  @AutoMap()
  redaction: string

  @AutoMap()
  publishedDate: Date

  authors: { user: UserModel }[]
}
