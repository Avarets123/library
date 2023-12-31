import { AutoMap } from '@automapper/classes'
import { Book } from '@prisma/client'
import { UserModel } from './user.model'
import { BookResourceModel } from './bookResource.model'

export class BookModel implements Book {
  @AutoMap()
  id: string

  @AutoMap()
  name: string

  @AutoMap()
  redaction: string

  @AutoMap()
  publishedDate: Date

  @AutoMap(() => BookResourceModel)
  bookResources: BookResourceModel[]

  authors: { user: UserModel }[]

  genres: { genre: { name: string } }[]
}
