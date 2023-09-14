import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { SpleenParserModule } from '../spleen/spleen-parser.module'
import { RepositoryProvider } from './services/repository.service'

@Global()
@Module({
  imports: [SpleenParserModule],
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
