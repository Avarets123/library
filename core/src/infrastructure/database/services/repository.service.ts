import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import * as _ from 'lodash'
import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'
import { SortItemDto } from '@infrastructure/common/pagination/dto/sortItem.dto'

@Injectable()
export class RepositoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  async findMany<T>(
    tableName: string,
    model: any,
    params: ListingDto,
    include?: Record<string, any>,
    andWhere?: Partial<T>,
  ) {
    const allFields = (await this.prisma.getTableFields(tableName)).map(
      (el) => el.column_name,
    )

    let where: any = {
      AND: {
        OR: await this.applySearch(params.query, tableName),
      },
    }

    if (andWhere) {
      _.merge(where, andWhere)
    }

    if (allFields.find((f) => f === 'deletedAt')) {
      where = {
        AND: {
          ...where,
          deletedAt: where.deletedAt ?? null,
        },
      }
    }

    const { skip, take } = this.countResponseItems(params)

    const records = model.findMany({
      where,
      orderBy: this.applyOrdering(params.sort),
      skip,
      take,
      include,
    })

    const recordsCount = model.count({
      where,
    })

    const [
      data,
      total,
    ] = await Promise.all([
      records,
      recordsCount,
    ])

    return {
      limit: params.limit,
      page: params.page,
      total: Number(total),
      data: data,
    }
  }

  applyOrdering(sort: SortItemDto[]) {
    return sort?.length
      ? sort.map((item) => ({ [item.field]: item.direction }))
      : ([{ createdAt: 'desc' }] as unknown)
  }

  async softDelete(model: any, where: any) {
    await model.updateMany({
      where: {
        ...where,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    })
  }

  private countResponseItems(params: ListingDto) {
    const { limit, page } = params

    const res = {
      skip: undefined,
      take: undefined,
    }

    if (limit === 0 || (!limit && !page)) {
      return res
    }

    res.skip = (page - 1) * limit
    res.take = limit

    return res
  }

  private async applySearch(search: string, tableName: string) {
    if (!search) return []

    const strFields = await this.prisma.getTableFieldsByType(tableName, 'text')
    return strFields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    }))
  }
}
