import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { RepositoryProvider } from '@infrastructure/database/services/repository.service'
import { Injectable } from '@nestjs/common'
import { GenreCreateDto } from '../dto/genreCreate.dto'
import { GenreExistsException } from '../exceptions/genreExists.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class GenresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: RepositoryProvider,
  ) {}

  async findMany(listing: ListingDto) {
    return this.repository.findMany('genre', this.prisma.genre, listing)
  }

  async create(data: GenreCreateDto) {
    const hasGenre = await this.getGenreByName(data.name)

    if (hasGenre) throw new GenreExistsException()

    return this.prisma.genre.create({
      data,
    })
  }

  async getGenresByNames(names: string[], prisma?: Prisma.TransactionClient) {
    if (!names?.length) return []
    return (prisma || this.prisma).genre.findMany({
      where: {
        name: {
          in: names,
        },
      },
    })
  }

  async createGenresByNames(names: string[], prisma?: Prisma.TransactionClient) {
    const data = names.map((name) => ({ name }))
    return (prisma || this.prisma).genre.createMany({
      data,
    })
  }

  async delete(id: string) {
    return this.prisma.genre.delete({
      where: {
        id,
      },
    })
  }

  async getGenreByName(name: string) {
    return this.prisma.genre.findFirst({
      where: {
        name,
      },
    })
  }
}
