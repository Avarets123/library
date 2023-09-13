import { Module } from '@nestjs/common'
import { DatabaseModule } from './infrastructure/database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { MapperModule } from './infrastructure/automapper/mapper.module'
import { RedisModule } from './infrastructure/redis/redis.module'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/users/users.module'

const secret = process.env.JWT_SECRET || 'secret'

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
  ],
})
export class AppModule {}
