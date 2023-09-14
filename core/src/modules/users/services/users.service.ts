import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { RepositoryProvider } from '@infrastructure/database/services/repository.service'
import { UserNotFoundException } from '@modules/auth/exceptions/userNotFound.exception'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserUpdateDto } from '../dto/userUpdate.dto'
import { User, UserRolesEnum } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: RepositoryProvider,
  ) {}

  async findMany(listing: ListingDto) {
    return this.repository.findMany('user', this.prisma.user, listing)
  }

  async findOneWithBooks(id: string) {
    return this.prisma.user
      .findFirstOrThrow({
        where: {
          id,
        },
        include: {
          books: {
            select: {
              book: true,
            },
          },
        },
      })
      .catch(() => {
        throw new UserNotFoundException()
      })
  }
  async updateUser(id: string, data: UserUpdateDto, authUser: User) {
    this.checkUserUpdatePermission(id, authUser)

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    })
  }

  checkUserUpdatePermission<T extends { id: string; role: UserRolesEnum }>(
    authorId: string,
    authUser: T,
  ) {
    const { id, role } = authUser

    if (id !== authorId || role !== UserRolesEnum.admin) {
      throw new ForbiddenException()
    }
  }
}
