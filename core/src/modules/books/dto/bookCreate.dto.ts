import {
  IsArray,
  IsDate,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class BookCreateDto {
  @IsString()
  name: string

  @IsString()
  redaction: string

  @IsDateString()
  publishedDate: Date

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @IsArray()
  authorsIds: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres: string[]
}
