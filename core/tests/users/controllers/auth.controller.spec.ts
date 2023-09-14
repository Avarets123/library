import { INestApplication } from '@nestjs/common'
import { initBaseModules } from '../../testInit'
import { PrismaService } from '@infrastructure/database/services/prisma.service'

let app: INestApplication
let prisma: PrismaService

beforeAll(async () => {
  const modules = await initBaseModules()
  app = modules.app
  prisma = modules.prisma

  await app.init()
})

describe('interaction with member', () => {})

afterAll(async () => await app.close())
