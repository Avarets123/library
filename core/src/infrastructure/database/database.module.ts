import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { SpleenParserModule } from '../spleen/spleen-parser.module'

@Global()
@Module({
  imports: [SpleenParserModule],
  providers: [
    PrismaService,
  ],
  exports: [
    PrismaService,
  ],
})
export class DatabaseModule {}
