import { Unique } from '@modules/globals/validators/unique.validator'
import { UserRolesEnum } from '@prisma/client'
import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator'

export class UserRegisterDto {
  @IsString()
  name: string

  @Unique('user', 'email')
  @IsEmail()
  email: string

  @IsEnum(UserRolesEnum)
  role: UserRolesEnum

  @IsString()
  password: string

  @IsDate()
  birthDate: Date
}
