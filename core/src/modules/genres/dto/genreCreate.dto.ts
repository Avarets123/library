import { Unique } from '@modules/globals/validators/unique.validator'
import { IsString } from 'class-validator'

export class GenreCreateDto {
  // @Unique('genre', 'name')
  @IsString()
  name: string
}
