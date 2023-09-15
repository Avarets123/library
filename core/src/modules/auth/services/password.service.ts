import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcrypt'
import { PasswordUndefinedException } from '../exceptions/passwordUndefined.exception'

@Injectable()
export class PasswordService {
  async hashingPassword(password: string, difficult = 8): Promise<string> {
    if (!password) {
      throw new PasswordUndefinedException()
    }

    return hash(password, difficult)
  }

  async comparePassword(
    hashPassword: string,
    rawPassword: string,
  ): Promise<boolean> {
    if (!rawPassword) {
      throw new PasswordUndefinedException()
    }

    return compare(rawPassword, hashPassword)
  }
}
