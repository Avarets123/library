import { AutoMap } from '@automapper/classes'
import { BookResourceModel } from '@infrastructure/database/models/bookResource.model'
import { UserReadDto } from '@modules/users/dto/userRead.dto'

export class BookReadDto {
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

  authors: UserReadDto[]

  genres: string[]
}
