import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infrastructure/database/services/prisma.service'

export const initBaseModules = async () => {
  const moduleTest = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const prisma = moduleTest.get(PrismaService)
  const app = moduleTest.createNestApplication()

  return {
    prisma,
    app,
  }
}
