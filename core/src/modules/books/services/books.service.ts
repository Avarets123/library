import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { Injectable } from '@nestjs/common'
import { BookCreateDto } from '../dto/bookCreate.dto'
import { GenresService } from '@modules/genres/services/genres.service'
import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { RepositoryProvider } from '@infrastructure/database/services/repository.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genresService: GenresService,
    private readonly repository: RepositoryProvider,
  ) {}

  async findMany(listing: ListingDto) {
    return this.repository.findMany('book', this.prisma.book, listing)
  }

  async create(dto: BookCreateDto) {
    const { genres, ...other } = dto

    await this.createNotExistsGenres(genres)

    const genresDb = await this.genresService.getGenresByNames(genres)

    await this.prisma.book.create({
      data: {
        ...other,
        genres: {
          createMany: {
            data: genresDb.map((el) => ({ genreId: el.id })),
          },
        },
      },
    })
  }

  private async createNotExistsGenres(genres: string[]) {
    const existsGenres = await this.genresService.getGenresByNames(genres)

    const existsGenresNames = new Set<string>(existsGenres.map((el) => el.name))

    const notExistsGenres = genres.filter((el) => !existsGenresNames.has(el))

    return await this.genresService.createGenresByNames(notExistsGenres)
  }

  async bookResourceUpload(bookId: string, file: Express.Multer.File) {
    await this.prisma.bookResource.create({
      data: {
        fileName: file.filename,
        filePath: '',
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

  async findBookByGenreId(genreId: string, listing: ListingDto) {
    const include: Prisma.BookInclude = {
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
}
