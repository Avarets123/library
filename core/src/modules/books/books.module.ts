import { GenresModule } from '@modules/genres/genres.module'
import { Module } from '@nestjs/common'
import { BooksService } from './services/books.service'
import { BooksController } from './controllers/books.controller'
import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [
    GenresModule,
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
