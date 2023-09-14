import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class BookCreateDto {
  @IsString()
  name: string

  @IsString()
  redaction: string

  @IsDate()
  publishedDate: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres: string[]
}
