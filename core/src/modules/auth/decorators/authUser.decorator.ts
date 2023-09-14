import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request?.user as User
    return data ? user?.[data] : user
  },
)
