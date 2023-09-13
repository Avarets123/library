import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcrypt'

@Injectable()
export class PasswordService {
  async hashingPassword(
    password: string,
    difficult: number = 8,
  ): Promise<string> {
    return hash(password, difficult)
  }

  async comparePassword(
    hashPassword: string,
    rawPassword: string,
  ): Promise<boolean> {
    return compare(rawPassword, hashPassword)
  }
}
