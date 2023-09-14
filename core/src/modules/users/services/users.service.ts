import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { RepositoryProvider } from '@infrastructure/database/services/repository.service'
import { UserNotFoundException } from '@modules/auth/exceptions/userNotFound.exception'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserUpdateDto } from '../dto/userUpdate.dto'
import { Prisma, User, UserRolesEnum } from '@prisma/client'
import { PasswordService } from '@modules/auth/services/password.service'
import { InjectMapper } from '@automapper/nestjs'
import { Mapper } from '@automapper/core'
import { UserModel } from '@infrastructure/database/models/user.model'
import { UserReadDto } from '../dto/userRead.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: RepositoryProvider,
    private readonly passwordService: PasswordService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findMany(listing: ListingDto) {
    const res = await this.repository.findMany(
      'user',
      this.prisma.user,
      listing,
      this.defaultUserIncludes(),
    )

    res.data = this.mapper.mapArray(res.data, UserModel, UserReadDto)

    return res
  }

  private defaultUserIncludes(): Prisma.UserInclude {
    return {
      books: {
        select: {
          book: {
            include: {
              bookResources: true,
            },
          },
        },
      },
    }
  }

  async findOneWithBooks(id: string) {
    return this.prisma.user
      .findFirstOrThrow({
        where: {
          id,
        },
        include: this.defaultUserIncludes(),
      })
      .catch(() => {
        throw new UserNotFoundException()
      })
  }
  async updateUser(id: string, data: UserUpdateDto, authUser: User) {
    this.checkUserUpdatePermission(id, authUser)

    const { password } = data

    data.password = password
      ? await this.passwordService.hashingPassword(password)
      : password

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

    if (id !== authorId && role !== UserRolesEnum.admin) {
      throw new ForbiddenException()
    }
  }
}
