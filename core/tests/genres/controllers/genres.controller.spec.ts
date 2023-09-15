import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { TokenService } from '@modules/auth/services/jwt.service'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { initBaseModules } from '../../testInit'
import * as request from 'supertest'
import { AuthService } from '@modules/auth/services/auth.service'
import { TestPropertiesBuilder } from '../../testBuilder.util'
import { createUserAndGetToken } from '../../users/utils/auth.util'
import { userRegValidData } from '../../users/data/user.data'
import { genreValidData } from '../data/genres.data'

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

describe('genres controller', () => {
  test('POST - /genres', async () => {
    const token = await createUserAndGetToken(
      userRegValidData,
      authService,
      prisma,
    )

    await prisma.genre.deleteMany({ where: { name: genreValidData.name } })

    const { body, status } = await request(app.getHttpServer())
      .post('/genres')
      .set('Authorization', `Bearer ` + token)
      .send(genreValidData)

    expect(status).toBe(HttpStatus.CREATED)
    expect(body).toMatchObject({
      name: expect.any(String),
      id: expect.any(String),
    })

    await prisma.genre.delete({
      where: { id: body.id },
    })
  })

  test('DELETE - /genres/:genreId', async () => {
    const token = await createUserAndGetToken(
      userRegValidData,
      authService,
      prisma,
    )

    await prisma.genre.deleteMany({ where: { name: 'newGenre' } })
    const newGenre = await prisma.genre.create({ data: { name: 'newGenre' } })

    const { status } = await request(app.getHttpServer())
      .delete('/genres/' + newGenre.id)
      .set('Authorization', `Bearer ` + token)

    expect(status).toBe(HttpStatus.NO_CONTENT)
  })
})
