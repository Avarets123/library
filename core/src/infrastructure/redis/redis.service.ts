import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { MemberStatusType } from 'src/modules/chat/types/memberStatus.type'

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) public redis: Cache) {}

  async set<T>(key: string, value: T, ttl?: number) {
    const SIX_HOURS = 1000 * 60 * 60 * 6

    return this.redis.set(key, value, ttl || SIX_HOURS)
  }

  async get<T>(key: string) {
    return this.redis.get<T>(key)
  }

  async mgetStatuses<T extends MemberStatusType>(keys: string[]) {
    try {
      const res = (await this.redis.store.mget(...keys)) as T[]

      return new Map<string, boolean>(
        res.map((item) => {
          if (!item)
            return [
              null,
              null,
            ]

          const { memberId, status } = item

          return [
            memberId,
            status,
          ]
        }),
      )
    } catch (error) {
      console.error(error)
    }
  }

  async del(key: string) {
    return this.redis.del(key)
  }
}
