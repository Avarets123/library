import { IsInt, IsOptional, IsString, isArray, isJSON } from 'class-validator'
import { Transform } from 'class-transformer'

const transformValueToNumber = ({ value }: { value: unknown }) => {
  const valueNumber = Number(value)

  value ? Number(value) : value

  return !!valueNumber ? valueNumber : value
}
export class ListingDto {
  @IsInt()
  @Transform(transformValueToNumber)
  limit = 10

  @IsInt()
  @Transform(transformValueToNumber)
  page = 1

  @IsOptional()
  @IsString()
  query: string
}
