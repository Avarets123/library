import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { Injectable } from '@nestjs/common'
import { BookCreateDto } from '../dto/bookCreate.dto'
import { GenresService } from '@modules/genres/services/genres.service'
import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { RepositoryProvider } from '@infrastructure/database/services/repository.service'
import { Prisma } from '@prisma/client'
import { createReadStream } from 'fs'
import { Stream } from 'stream'
import { BookUpdateDto } from '../dto/bookUpdate.dto'
import { BookExistsException } from '../exceptions/bookExists.exception'
import { Mapper } from '@automapper/core'
import { InjectMapper } from '@automapper/nestjs'
import { BookModel } from '@infrastructure/database/models/book.model'
import { BookReadDto } from '../dto/bookRead.dto'

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genresService: GenresService,
    private readonly repository: RepositoryProvider,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findMany(listing: ListingDto) {
    const res = await this.repository.findMany(
      'book',
      this.prisma.book,
      listing,
      this.bookDefaultIncludes(),
    )

    
    res.data = this.mapper.mapArray(res.data, BookModel, BookReadDto)

    return res
  }

  private connectBookToAuthors(authorsIds: string[]) {
    if (!authorsIds?.length) return undefined

    return {
      createMany: {
        data: authorsIds.map((userId) => ({ userId })),
      },
    }
  }

  async create(dto: BookCreateDto) {
    const { genres, authorsIds, ...other } = dto

    await this.createNotExistsGenres(genres)

    const genresDb = await this.genresService.getGenresByNames(genres)

    await this.prisma.book.create({
      data: {
        ...other,
        authors: this.connectBookToAuthors(authorsIds),
        genres: {
          createMany: {
            data: genresDb.map((el) => ({ genreId: el.id })),
          },
        },
      },
    })
  }

  private async createNotExistsGenres(genres: string[] = []) {
    const existsGenres = await this.genresService.getGenresByNames(genres)

    const existsGenresNames = new Set<string>(existsGenres.map((el) => el.name))

    const notExistsGenres = genres.filter((el) => !existsGenresNames.has(el))

    return await this.genresService.createGenresByNames(notExistsGenres)
  }

  async bookResourceUpload(bookId: string, file: Express.Multer.File) {
    return this.prisma.bookResource.create({
      data: {
        fileName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        size: file.size,
        bookId,
      },
    })
  }

  async findBookResources(bookId: string) {
    return this.prisma.bookResource.findMany({
      where: {
        bookId,
      },
    })
  }

  private bookDefaultIncludes(): Prisma.BookInclude {
    return {
      bookResources: true,
      authors: {
        select: {
          user: true,
        },
      },
      genres: {
        select: {
          genre: {
            select: {
              name: true,
            },
          },
        },
      },
    }
  }

  async findBookByGenreId(genreId: string, listing: ListingDto) {
    const include: Prisma.BookInclude = this.bookDefaultIncludes()

    const where: Prisma.BookWhereInput = {
      genres: {
        some: {
          genreId,
        },
      },
    }

    return this.repository.findMany<Prisma.BookWhereInput>(
      'book',
      this.prisma.book,
      listing,
      include,
      where,
    )
  }

  async bookDelete(id: string) {
    await this.prisma.book.delete({
      where: {
        id,
      },
    })
  }

  async bookResourceDelete(id: string) {
    return this.prisma.bookResource.delete({
      where: {
        id,
      },
    })
  }

  async getBookResourceFile(
    resourceId: string,
    bookId: string,
  ): Promise<Stream> {
    const bookResource = await this.prisma.bookResource.findFirstOrThrow({
      where: {
        id: resourceId,
        bookId,
      },
    })

    return createReadStream(bookResource.filePath)
  }

  async bookUpdate(bookId: string, dto: BookUpdateDto) {
    const { authorsIds, name, genres, ...other } = dto

    if (name) await this.checkUniqueBook(name)

    await this.createNotExistsGenres(genres)

    const genresDb = await this.genresService.getGenresByNames(genres)

    await this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ...other,
        name,
        authors: this.connectBookToAuthors(authorsIds),
        genres: {
          createMany: {
            data: genresDb.map((el) => ({ genreId: el.id })),
          },
        },
      },
    })
  }

  private async checkUniqueBook(name: string) {
    const hasBook = await this.prisma.book.findFirst({
      where: {
        name,
      },
      select: {
        id: true,
      },
    })

    if (hasBook) {
      throw new BookExistsException()
    }
  }
}
