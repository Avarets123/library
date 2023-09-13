import { IsDate, IsOptional, IsString } from 'class-validator'

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  password: string

  @IsOptional()
  @IsDate()
  birthDate: Date
}
