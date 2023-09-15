import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { TokenService } from '@modules/auth/services/jwt.service'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { initBaseModules } from '../../testInit'
import * as request from 'supertest'
import { createUser, deleteUserByEmail } from '../utils/user.util'
import { userRegValidData } from '../data/user.data'
import { AuthService } from '@modules/auth/services/auth.service'
import { concatGmail } from '../utils/auth.util'

let app: INestApplication
let prisma: PrismaService
let tokenService: TokenService
let authService: AuthService

beforeAll(async () => {
  const modules = await initBaseModules()
  app = modules.app
  prisma = modules.prisma

  authService = modules.moduleTest.get(AuthService)
  tokenService = modules.moduleTest.get(TokenService)
  await app.init()
})

describe('user controller', () => {
  test('PATCH - /authors/:authorId', async () => {
    userRegValidData.email = concatGmail('five')

    await deleteUserByEmail(userRegValidData.email, prisma)

    const newUser = await createUser(userRegValidData, authService)

    const token = (await tokenService.getTokens(newUser)).accessToken

    const { status } = await request(app.getHttpServer())
      .patch('/authors/' + newUser.id)
      .set('Authorization', `Bearer ` + token)
      .send({ name: 'test' })

    expect(status).toBe(HttpStatus.NO_CONTENT)
  })

  test('PATCH - /authors/:authorId - update other user', async () => {
    const otherEmail = 'testA@gmail.com'
    userRegValidData.email = concatGmail('six')

    await deleteUserByEmail(userRegValidData.email, prisma)
    await deleteUserByEmail(otherEmail, prisma)

    const newUser = createUser(userRegValidData, authService)
    const newUser2 = createUser(
      { ...userRegValidData, email: otherEmail },
      authService,
    )

    const [
      first,
      second,
    ] = await Promise.all([
      newUser,
      newUser2,
    ])

    const token = (await tokenService.getTokens(first)).accessToken

    const { status } = await request(app.getHttpServer())
      .patch('/authors/' + second.id)
      .set('Authorization', `Bearer ` + token)
      .send({ name: 'test' })

    expect(status).toBe(HttpStatus.FORBIDDEN)
  })

  test('PATCH - /authors/:authorId - admin update any user', async () => {
    const otherEmail = 'testAdmin@gmail.com'
    userRegValidData.email = concatGmail('seven')

    await deleteUserByEmail(userRegValidData.email, prisma)
    await deleteUserByEmail(otherEmail, prisma)

    const newUser = createUser(userRegValidData, authService)
    const newUser2 = createUser(
      { ...userRegValidData, email: otherEmail, role: 'admin' },
      authService,
    )

    const [
      first,
      admin,
    ] = await Promise.all([
      newUser,
      newUser2,
    ])

    const token = (await tokenService.getTokens(admin)).accessToken

    const { status } = await request(app.getHttpServer())
      .patch('/authors/' + first.id)
      .set('Authorization', `Bearer ` + token)
      .send({ name: 'test' })

    expect(status).toBe(HttpStatus.NO_CONTENT)
  })
})
