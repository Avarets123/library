import { Module } from '@nestjs/common'
import { DatabaseModule } from './infrastructure/database/database.module'
import { RMQModule, getEnv } from './infrastructure/rmq/rmq.module'
import { ChatModule } from './modules/chat/chat.module'
import { JwtModule } from '@nestjs/jwt'
import { WsAuthModule } from './modules/wsAuth/wsAuth.module'
import { MapperModule } from './infrastructure/automapper/mapper.module'
import { TagsModule } from './modules/tags/tags.module'
import { RedisModule } from './infrastructure/redis/redis.module'

type RmqResponseType = 'RESPONSE' | 'QUEUE' | undefined

const secret = getEnv('JWT_SECRET') || 'secret'
export const RMQ_RESPONSE_TYPE = getEnv('RMQ_RESPONSE_TYPE') as RmqResponseType

@Module({
  imports: [
    DatabaseModule,
    RMQModule,
    ChatModule,
    JwtModule.register({
      global: true,
      secret,
    }),
    RedisModule,
    WsAuthModule,
    MapperModule,
    TagsModule,
  ],
})
export class AppModule {}
