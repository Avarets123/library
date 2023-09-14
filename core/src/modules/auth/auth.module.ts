import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { TokenService } from './services/jwt.service'
import { PasswordService } from './services/password.service'
import { UniqueConstraint } from '@modules/globals/validators/unique.validator'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    PasswordService,
  ],
  exports: [PasswordService],
})
export class AuthModule {}
