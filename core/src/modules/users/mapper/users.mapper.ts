import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { UserModel } from '@infrastructure/database/models/user.model'
import { UserReadDto } from '../dto/userRead.dto'
import { BookModel } from '@infrastructure/database/models/book.model'
import { BookReadDto } from '@modules/books/dto/bookRead.dto'

export class UsersMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        UserModel,
        UserReadDto,
        forMember(
          (d) => d.books,

          mapFrom((e) => {
            if (!e.books) return undefined

            return mapper.mapArray(
              e.books.map((el) => el.book),
              BookModel,
              BookReadDto,
            )
          }),
        ),
      )
    }
  }
}
