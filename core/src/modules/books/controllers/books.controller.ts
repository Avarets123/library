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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { BooksService } from '../services/books.service'
import { JwtAuthGuard } from '@modules/auth/guards/jwtAuth.guard'
import { RolesGuard } from '@modules/auth/guards/roles.guard'
import { Roles } from '@modules/auth/decorators/roles.decorator'
import { UserRolesEnum } from '@prisma/client'
import { BookCreateDto } from '../dto/bookCreate.dto'
import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  create(@Body() body: BookCreateDto) {
    return this.booksService.create(body)
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findMany(@Query() listing: ListingDto) {
    return this.booksService.findMany(listing)
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':bookId/resources/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  bookUpload(@UploadedFile() file: Express.Multer.File) {}

  @HttpCode(HttpStatus.OK)
  @Get(':bookId/resources/:resourceId/download')
  @UseGuards(JwtAuthGuard)
  bookResourceDownload(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Param('resourceId', ParseUUIDPipe) resourceId: string,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('genres/:genreId')
  @UseGuards(JwtAuthGuard)
  findBooksByGenre(@Param('genreId', ParseUUIDPipe) genreId: string, @Query() lsiting: ListingDto) {
    return this.booksService.findBookByGenreId(genreId, lsiting)
  }

  @HttpCode(HttpStatus.OK)
  @Get(':bookId/resources')
  @UseGuards(JwtAuthGuard)
  bookResources(@Param('bookId') bookId: string) {
    return this.booksService.findBookResources(bookId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':bookId/resources/:resourceId/remove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  bookResourcesDelete(@Param('resourceId') resourceId: string) {
    return this.booksService.bookResourceDelete(resourceId)
  }
}
