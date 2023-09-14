import { IsEnum, IsString } from 'class-validator'

export enum DirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortItemDto {
  @IsString()
  field: string

  @IsEnum(DirectionEnum)
  direction: DirectionEnum
}
