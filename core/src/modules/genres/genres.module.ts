import { Module } from '@nestjs/common'
import { GenresService } from './services/genres.service'
import { GenresController } from './controllers/genre.controller'

@Module({
  providers: [GenresService],
  controllers: [GenresController],
  exports: [GenresService],
})
export class GenresModule {}
