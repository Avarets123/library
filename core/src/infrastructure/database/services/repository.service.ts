import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import * as _ from 'lodash'
import { ListingDto } from '@infrastructure/common/pagination/dto/listing.dto'

@Injectable()
export class RepositoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  async findMany<T>(
    model: any,
    params: ListingDto,
    include?: Record<string, any>,
    andWhere?: Partial<T>,
  ) {
    let where: any = {}

    if (andWhere) {
      _.merge(where, andWhere)
    }

    const { skip, take } = this.countResponseItems(params)

    const records = model.findMany({
      where,
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
}
