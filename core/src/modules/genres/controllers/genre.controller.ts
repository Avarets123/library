import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { GenresService } from '../services/genres.service'
import { GenreCreateDto } from '../dto/genreCreate.dto'
import { JwtAuthGuard } from '@modules/auth/guards/jwtAuth.guard'
import { RolesGuard } from '@modules/auth/guards/roles.guard'
import { Roles } from '@modules/auth/decorators/roles.decorator'
import { UserRolesEnum } from '@prisma/client'
import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  @Post()
  create(@Body() body: GenreCreateDto) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findMany(@Query() listing: ListingDto) {
    return this.genresService.findMany(listing)
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':genreId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  delete(@Param('genreId', ParseUUIDPipe) genreId: string) {
    return this.genresService.delete(genreId)
  }
}
