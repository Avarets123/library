import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { Injectable } from '@nestjs/common'
import { UserRegisterDto } from '../dto/userRegister.dto'
import { compare, hash } from 'bcrypt'
import { UserLoginDto } from '../dto/userLogin.dto'
import { User } from '@prisma/client'
import { JwtReturnType } from '../types/jwtReturn.type'
import { TokenService } from './jwt.service'
import { PasswordService } from './password.service'
import { UserNotFoundException } from '../exceptions/userNotFound.exception'
import { InvalidPasswordException } from '../exceptions/invalidPassword.exception'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(dto: UserRegisterDto): Promise<User> {
    const { email, password, ...other } = dto

    const hashedPassword = await this.passwordService.hashingPassword(password)

    return this.prisma.user.create({
      data: {
        ...other,
        email,
        password: hashedPassword,
      },
    })
  }

  async login(dto: UserLoginDto): Promise<JwtReturnType> {
    const { email, password } = dto

    const hasUser = await this.prisma.user
      .findFirstOrThrow({
        where: {
          email,
        },
        select: {
          id: true,
          password: true,
        },
      })
      .catch(() => {
        throw new UserNotFoundException()
      })

    const isValidPassword = await this.passwordService.comparePassword(
      hasUser.password,
      password,
    )

    if (!isValidPassword) throw new InvalidPasswordException()

    return this.tokenService.getTokens(hasUser)
  }
}
