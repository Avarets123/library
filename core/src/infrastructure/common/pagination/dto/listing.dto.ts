import { IsInt, IsOptional, IsString, isArray, isJSON } from 'class-validator'
import { Transform } from 'class-transformer'
import { SortItemDto } from './sortItem.dto'

export class ListingDto {
  @IsInt()
  @Transform(({ value }) => {
    let val
    const nullArr = [
      null,
      'null',
      0,
    ]
    if (nullArr.includes(value)) {
      val = 0
    } else {
      val = Number(value)
    }
    return val
  })
  limit = 10

  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : value))
  page = 1

  @IsOptional()
  @IsString()
  query: string

  @IsOptional()
  @Transform(({ value }) => {
    let transformValue
    if (isArray(value)) {
      transformValue = value
        .map((item) => {
          if (isJSON(item)) return JSON.parse(item)
        })
        .filter(Boolean)
    } else {
      transformValue = isJSON(value) ? [JSON.parse(value)] : []
    }
    return transformValue
  })
  sort: SortItemDto[]
}
