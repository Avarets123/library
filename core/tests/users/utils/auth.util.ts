import { UserRegisterDto } from '@modules/auth/dto/userRegister.dto'
import { AuthService } from '@modules/auth/services/auth.service'
import { deleteUserByEmail } from './user.util'
import { PrismaService } from '@infrastructure/database/services/prisma.service'

export const createUserAndGetToken = async (
  data: UserRegisterDto,
  authService: AuthService,
  prisma: PrismaService,
  isAdmin: boolean = true,
) => {
  await deleteUserByEmail(data.email, prisma)

  if (isAdmin) {
    data.role = 'admin'
  }

  const newUser = await authService.register(data)

  return (await authService.login(data)).accessToken
}
