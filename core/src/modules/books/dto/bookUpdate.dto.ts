import {
  IsArray,
  IsDate,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class BookUpdateDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  redaction: string

  @IsOptional()
  @IsDateString()
  publishedDate: string

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @IsArray()
  authorsIds: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres: string[]
}
