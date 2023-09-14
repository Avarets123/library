import { GenresModule } from '@modules/genres/genres.module'
import { Module } from '@nestjs/common'
import { BooksService } from './services/books.service'
import { BooksController } from './controllers/books.controller'
import { BookMapper } from './mapper/book.mapper'

@Module({
  imports: [
    GenresModule,
  ],
  providers: [
    BooksService,
    BookMapper,
  ],
  controllers: [BooksController],
})
export class BooksModule {}
