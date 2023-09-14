import { AutoMap } from '@automapper/classes'
import { BookResource } from '@prisma/client'

export class BookResourceModel implements BookResource {
  @AutoMap()
  id: string

  @AutoMap()
  filePath: string

  @AutoMap()
  fileName: string

  @AutoMap()
  mimeType: string

  @AutoMap()
  size: number

  bookId: string
}
