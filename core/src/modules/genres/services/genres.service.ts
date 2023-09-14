import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { RepositoryProvider } from '@infrastructure/database/services/repository.service'
import { Injectable } from '@nestjs/common'
import { GenreCreateDto } from '../dto/genreCreate.dto'

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
    return this.prisma.genre.create({
      data,
    })
  }

  async getGenresByNames(names: string[]) {
    return this.prisma.genre.findMany({
      where: {
        name: {
          in: names,
        },
      },
    })
  }

  async createGenresByNames(names: string[]) {
    const data = names.map((name) => ({ name }))
    return this.prisma.genre.createMany({
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
}
