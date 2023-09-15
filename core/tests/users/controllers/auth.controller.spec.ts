import { INestApplication } from '@nestjs/common'
import { initBaseModules } from '../../testInit'
import { PrismaService } from '@infrastructure/database/services/prisma.service'
import * as request from 'supertest'
import { createUser, deleteUserByEmail } from '../utils/user.util'
import { AuthService } from '@modules/auth/services/auth.service'
import { userRegInValidData, userRegValidData } from '../data/user.data'
import { concatGmail } from '../utils/auth.util'

let app: INestApplication
let prisma: PrismaService
let authService: AuthService

beforeAll(async () => {
  const modules = await initBaseModules()
  app = modules.app
  prisma = modules.prisma

  authService = modules.moduleTest.get(AuthService)
  await app.init()
})

describe('auth controller', () => {
  test('POST - /auth/register - by invalid data', async () => {
    request(app.getHttpServer())
      .post('/auth/register')
      .send(userRegInValidData)
      .expect(422)
  })

  test('POST - /auth/register', async () => {
    userRegValidData.email = concatGmail('one')

    await deleteUserByEmail(userRegValidData.email, prisma)
    const { body } = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userRegValidData)

    expect(body).toMatchObject({
      ...userRegValidData,
      password: expect.any(String),
      birthDate: expect.anything(),
    })
  })

  test('POST - /auth/login', async () => {
    userRegValidData.email = concatGmail('two')

    await deleteUserByEmail(userRegValidData.email, prisma)

    await createUser(userRegValidData, authService)

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: userRegValidData.password,
        email: userRegValidData.email,
      })

    expect(body).toMatchObject({ accessToken: expect.any(String) })
  })

  test('POST - /auth/login - by inValid password', async () => {
    userRegValidData.email = concatGmail('three')

    await deleteUserByEmail(userRegValidData.email, prisma)

    await createUser(userRegValidData, authService)

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userRegValidData.email, password: userRegValidData.name })
      .expect(400)

    // expect(body).toThrowError(InvalidPasswordException)
  })

  test('POST - /auth/login - by not exists user', async () => {
    userRegValidData.email = concatGmail('four')

    await deleteUserByEmail(userRegValidData.email, prisma)
    await createUser(userRegValidData, authService)

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userRegValidData.password,
        password: userRegValidData.password,
      })
      .expect(404)

    // expect(body).toThrow(new InvalidPasswordException())
  })
})

afterAll(async () => await app.close())
