import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { BookReadDto } from '../dto/bookRead.dto'
import { BookModel } from '@infrastructure/database/models/book.model'
import { UserModel } from '@infrastructure/database/models/user.model'
import { UserReadDto } from '@modules/users/dto/userRead.dto'
import { BookResourceModel } from '@infrastructure/database/models/bookResource.model'

export class BookMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, BookResourceModel)

      createMap(
        mapper,
        BookModel,
        BookReadDto,
        forMember(
          (d) => d.authors,
          mapFrom((e) => {
            if (!e.authors) return undefined

            const authors = e.authors.map((el) => el.user)

            return mapper.mapArray(authors, UserModel, UserReadDto)
          }),
        ),
        forMember(
          (d) => d.genres,
          mapFrom((e) => {
            if (!e?.genres) return undefined

            return e.genres.map((el) => el.genre.name)
          }),
        ),
      )
    }
  }
}
