import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { UserRegisterDto } from '@modules/auth/dto/userRegister.dto'
import { AuthService } from '@modules/auth/services/auth.service'
import { TokenService } from '@modules/auth/services/jwt.service'

export const deleteUserByEmail = async (
  email: string,
  prisma: PrismaService,
) => {
  await prisma.user.deleteMany({
    where: {
      email,
    },
  })
}

export const createUser = async (
  data: UserRegisterDto,
  authService: AuthService,
) => {
  return authService.register(data)
}

export const getToken = async (userId: string, tokenService: TokenService) =>
  tokenService.getTokens({ id: userId })
