import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { RepositoryProvider } from './services/repository.service'

@Global()
@Module({
  providers: [
    PrismaService,
    RepositoryProvider,
  ],
  exports: [
    PrismaService,
    RepositoryProvider,
  ],
})
export class DatabaseModule {}
