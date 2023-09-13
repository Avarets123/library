import { Module } from '@nestjs/common'
import { SpleenParser } from './spleen-parser'

@Module({
  providers: [SpleenParser],
  exports: [SpleenParser],
})
export class SpleenParserModule {}
