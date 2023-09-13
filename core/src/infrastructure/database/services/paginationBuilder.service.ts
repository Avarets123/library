import * as _ from 'lodash'
import { PrismaService } from './prisma.service'
import { Mapper } from '@automapper/core'
import { SpleenHandler } from 'src/infrastructure/spleen/filterHandler'
import { AdditionalFilterType } from 'src/infrastructure/spleen/relationFilter/additionalFilter.type'
import { ListingByIdsType } from '../types/listings.type'
import { BadRequestException } from '@nestjs/common'

export class PaginationBuilder<T> {
  constructor(
    private readonly prisma: PrismaService,
    private mapper?: Mapper,
  ) {}

  private data: {
    tableName?: string
    model?: any
    params?: any
    andWhere?: unknown
    include?: Record<string, any>
    distinctField?: keyof T
    onlyData?: boolean
    addFilters?: AdditionalFilterType[]
    after?: { after: string; field: string }
    before?: { before: string; field: string }
    map?: { from?; to?; async?: boolean }
    sort?: { [field: string]: string }
  } = {}

  setTable(tableName: string): this {
    this.data.tableName = tableName

    return this
  }

  setModel(model: any): this {
    this.data.model = model

    return this
  }

  setParams(params: ListingByIdsType): this {
    this.data.params = params

    return this
  }

  setWhere<T>(where: Partial<T>): this {
    this.data.andWhere = where

    return this
  }

  setInclude(include: Record<string, any>): this {
    this.data.include = include

    return this
  }

  setGettingOnlyData() {
    this.data.onlyData = true

    return this
  }

  setUnique(field: keyof T): this {
    this.data.distinctField = field

    return this
  }

  setMapping<S, D>(mapper: Mapper, from: S, to: D, async = false) {
    this.mapper = mapper

    this.data.map = {
      from,
      to,
      async,
    }

    return this
  }

  setAdditionalFilters(filters: AdditionalFilterType[]) {
    this.data.addFilters = filters

    return this
  }

  setAfter(after: string, field: string) {
    this.data.after = { after, field }

    return this
  }

  setSort(field: string, direction: 'asc' | 'desc') {
    this.data.sort = { [field]: direction }

    return this
  }

  setBefore(before: string, field: string) {
    this.data.before = { before, field }

    return this
  }

  async build() {
    const {
      distinctField,
      include,
      model,
      params,
      tableName,
      andWhere,
      onlyData,
    } = this.data

    const allFields = (await this.prisma.getTableFields(tableName)).map(
      (el) => el.column_name,
    )

    let where: any = {}
    let filtersShow
    if (params) {
      const { filter, filtersDisplay } = this.applySpleen(
        params.filter,
        allFields,
        this.data.addFilters,
      )

      filtersShow = filtersDisplay

      where = {
        AND: {
          OR: await this.applySearch(params.query, tableName),
          ...filter,
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

      let { skip, take } = this.countResponseItems(params)

      const distinct = distinctField || undefined

      if (this.data.after?.after || this.data.before?.before) {
        _.merge(where, await this.applyAfterBefore())
      }

      const records = model.findMany({
        where,
        orderBy: this.data.sort || undefined,
        skip,
        take,
        include: include,
        distinct,
      })

      if (onlyData) {
        if (this.data.map) {
          const { from, to, async } = this.data.map

          const map: any = async ? 'mapAsync' : 'map'

          return records.then((res) =>
            res.map((el) => this.mapper[map](el, from, to)),
          )
        }
        return records
      }

      const recordsCount = model.count({
        where,
      })

      let [
        data,
        total,
      ] = await Promise.all([
        records,
        recordsCount,
      ])

      if (this.data.map) {
        data = this.mapper.mapArray(data, this.data.map.from, this.data.map.to)
      }

      return {
        limit: params.limit,
        page: params.page,
        total: Number(total),
        data,
        $aggregations: {},
        filters: filtersShow,
      }
    }
  }

  private countResponseItems(params: ListingByIdsType) {
    const res = {
      skip: undefined,
      take: undefined,
    }

    if (!params) return res

    const { limit } = params

    if (limit === 0 || limit === null) {
      return res
    }

    limit ? (res.take = limit) : (res.take = 10)

    return res
  }

  private async applyAfterBefore() {
    this.checkBeforeAfterIds(this.data.before?.before, this.data.after?.after)

    if (this.data.after?.after) {
      const { after, field } = this.data.after
      const gte = await this.data.model
        .findFirst({
          where: {
            id: after,
          },
          select: {
            [field]: true,
          },
        })
        .then((res) => res[field])

      return {
        [field]: {
          gte,
        },
      }
    }

    const { before, field } = this.data.before

    const lte = await this.data.model
      .findFirst({
        where: {
          id: before,
        },
        select: {
          [field]: true,
        },
      })
      .then((res) => res[field])

    return {
      [field]: {
        lte,
      },
    }

    // this.prisma.chatRooms.findMany({
    //   where: {
    //     lastActivityAt: {
    //       gte,
    //       lte,
    //     },
    //   },
    // })
  }

  private applySpleen(
    input: string,
    fields: string[],
    additionalFilters?: AdditionalFilterType[],
  ) {
    const filterHandler = new SpleenHandler()

    fields.forEach((el) => filterHandler.addField(el))

    const filter = input
      ? filterHandler.build(input, additionalFilters)
      : undefined

    return {
      filter,
      filtersDisplay: filterHandler.transformToShow(additionalFilters),
    }
  }

  private checkBeforeAfterIds(beforeId: string, afterId: string) {
    if (beforeId && afterId) {
      throw new BadRequestException({
        message: 'BeforeId и AfterId не должны быть вместе заданы!',
      })
    }
  }

  private async applySearch(search: string, tableName: string) {
    if (!search) return []

    const strFields = await this.prisma.getTableFieldsByType(tableName, 'text')
    return strFields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    }))
  }
}
