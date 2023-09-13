import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getJwtSecret } from '../utils/getJwtSecret.util'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async getTokens<T extends { id: string }>(payload: T) {
    const accessToken = await this.jwtService.signAsync(
      { sub: payload.id },
      { secret: getJwtSecret() },
    )

    return {
      accessToken,
    }
  }
}
