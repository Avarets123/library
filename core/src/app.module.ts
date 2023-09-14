import { Module } from '@nestjs/common'
import { DatabaseModule } from './infrastructure/database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { MapperModule } from './infrastructure/automapper/mapper.module'
import { RedisModule } from './infrastructure/redis/redis.module'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/users/users.module'
import { getJwtSecret } from '@modules/auth/utils/getJwtSecret.util'
import { MulterModule } from '@nestjs/platform-express'
import { UniqueConstraint } from '@modules/globals/validators/unique.validator'

const secret = getJwtSecret()

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret,
    }),
    // RedisModule,
    MapperModule,
    AuthModule,
    UserModule,
    MulterModule.register({
      dest: './books'
    })
  ],
  providers: [UniqueConstraint]
})
export class AppModule {}
