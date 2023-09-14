import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
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
import { Response } from 'express'
import { BookUpdateDto } from '../dto/bookUpdate.dto'
import { MapInterceptor } from '@automapper/nestjs'
import { BookResourceModel } from '@infrastructure/database/models/bookResource.model'
import { BookModel } from '@infrastructure/database/models/book.model'
import { BookReadDto } from '../dto/bookRead.dto'

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
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './books',
    }),
  )
  @Post(':bookId/resources/upload')
  @UseInterceptors(MapInterceptor(BookResourceModel, BookResourceModel))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  bookUpload(
    @UploadedFile() file: Express.Multer.File,
    @Param('bookId') bookId: string,
  ) {
    return this.booksService.bookResourceUpload(bookId, file)
  }

  @HttpCode(HttpStatus.OK)
  @Get(':bookId/resources/:resourceId/download')
  @UseGuards(JwtAuthGuard)
  async bookResourceDownload(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Param('resourceId', ParseUUIDPipe) resourceId: string,
    @Res() res: Response,
  ) {
    const resourceStream = await this.booksService.getBookResourceFile(
      resourceId,
      bookId,
    )

    resourceStream.pipe(res)
  }

  @HttpCode(HttpStatus.OK)
  @Get('genres/:genreId')
  @UseGuards(JwtAuthGuard)
  findBooksByGenre(
    @Param('genreId', ParseUUIDPipe) genreId: string,
    @Query() lsiting: ListingDto,
  ) {
    return this.booksService.findBookByGenreId(genreId, lsiting)
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MapInterceptor(BookResourceModel, BookResourceModel, { isArray: true }),
  )
  @Get(':bookId/resources')
  @UseGuards(JwtAuthGuard)
  bookResources(@Param('bookId', ParseUUIDPipe) bookId: string) {
    return this.booksService.findBookResources(bookId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':bookId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  bookUpdate(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Body() body: BookUpdateDto,
  ) {
    return this.booksService.bookUpdate(bookId, body)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':bookId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  bookDelete(@Param('bookId', ParseUUIDPipe) bookId: string) {
    return this.booksService.bookDelete(bookId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':bookId/resources/:resourceId/remove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRolesEnum.admin)
  bookResourcesDelete(@Param('resourceId', ParseUUIDPipe) resourceId: string) {
    return this.booksService.bookResourceDelete(resourceId)
  }
}
