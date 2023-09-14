import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { UsersController } from './controllers/users.controller'
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy'
import { AuthModule } from '@modules/auth/auth.module'
import { UsersMapper } from './mapper/users.mapper'

@Module({
  providers: [
    UsersService,
    JwtStrategy,
    UsersMapper,
  ],
  controllers: [UsersController],
  imports: [AuthModule],
})
export class UserModule {}
