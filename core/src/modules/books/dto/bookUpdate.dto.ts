import { IsDate, IsOptional, IsString } from 'class-validator'

export class BookCreateDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  redaction: string

  @IsOptional()
  @IsDate()
  publishedDate: string
}
