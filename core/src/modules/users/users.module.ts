import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { UsersController } from './controllers/users.controller'
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy'
import { AuthModule } from '@modules/auth/auth.module'

@Module({
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  imports: [AuthModule]
})
export class UserModule {}
