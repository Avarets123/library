import { BadRequestException } from '@nestjs/common'
import { SpleenParser } from './spleen-parser'
import { parse } from 'spleen'
import * as _ from 'lodash'
import {
  AdditionalFilterType,
  FilterDataType,
} from './relationFilter/additionalFilter.type'
import {
  applyAdditionalFilter,
  buildRelationQuery,
} from './relationFilter/additionalFilter'
import { SpleenOperatorsTypeEnum } from './enums/operatorsType.enum'
import { SpleenOperatorsEnum } from './enums/operators.enum'
import { getOperators } from './decorators/availableOperators'

export class SpleenHandler {
  private fields = new Map<string, string[]>()
  private filtersName = new Map<string, string>()
  private spleenParser = new SpleenParser()
  private where = {}

  addField(
    field: string,
    availableOperators: SpleenOperatorsEnum[] = getOperators(
      SpleenOperatorsTypeEnum.ALL_OPERATORS,
    ),
    filterName?: string,
  ) {
    this.fields.set(field, availableOperators)
    if (filterName) this.filtersName.set(field, filterName)
    return this
  }

  private checkFieldsAndOperators(field: string, operators: string[]) {
    const fieldOperators = this.fields.get(field)

    if (!fieldOperators) {
      throw new BadRequestException({
        message: `Filter by field: ${field} not exists`,
      })
    }

    operators.forEach((el) => {
      const hasOperator = fieldOperators.includes(el)

      if (!hasOperator) {
        throw new BadRequestException({
          message: `Filter by operator: ${el} not exists`,
        })
      }
    })
  }

  private getParsedInputObject(input: string) {
    const parsedValue = parse(input)

    const resObj = {}
    parsedValue.value.statements.forEach((el) => {
      const field = el.value.subject.path[0]
      const operator = el.value.operator.type

      const valueField = resObj[field]

      if (valueField) return valueField.push(operator)

      resObj[field] = [operator]
    })

    return resObj
  }

  private getFilterFieldsAndValue(input: string) {
    const output = parse(input)

    const res = []

    output.value.statements.forEach((el) => {
      const obj = {}

      const field = el.value.subject.path[0]
      const operator = el.value.operator.type
      const value = el.value.object

      const valueField = obj[field]

      if (valueField) return valueField.push(operator)

      obj[field] = [operator]
      obj['value'] = value

      res.push(obj)
    })

    return res
  }

  private replaceForFilterName(input: string) {
    let newInput = input
    this.filtersName.forEach((v, k) => {
      //@ts-ignore
      newInput = newInput.replaceAll(v, k)
    })

    return newInput
  }

  public build(input: string, additionalFilters?: AdditionalFilterType[]) {
    const newInput = this.replaceForFilterName(input)

    const availablefields = [...this.fields].map((el) => el[0])

    this.where = this.spleenParser.build(newInput, availablefields)

    this.useAdditionalFilter(input, additionalFilters, this.where)
    return this.where
  }

  private useAdditionalFilter(
    input: string,
    filters: AdditionalFilterType[],
    where: object,
  ) {
    if (!filters?.length) return

    const objFieldsValue = this.getFilterFieldsAndValue(input)

    const fieldsData = filteringAndMaping(
      filters,
      this.filterFields(objFieldsValue),
      this.mappingFiltersToFilterData(objFieldsValue),
    )

    fieldsData.forEach(applyAdditionalFilter(where, buildRelationQuery))
  }

  private mappingFiltersToFilterData(objFieldsValue: any[]) {
    return ({
      field,
      relation,
      filterName,
      where,
    }: AdditionalFilterType): FilterDataType => {
      const fieldObj = objFieldsValue.find((el) => filterName in el)

      const operator = fieldObj[filterName][0]
      const value = fieldObj['value']

      return {
        field,
        relation,
        operator,
        value,
        where,
      }
    }
  }

  private filterFields(objFields: object[]) {
    return ({ filterName }: AdditionalFilterType) => {
      return objFields.some((el) => Boolean(el[filterName]))
    }
  }

  public bind(where: unknown) {
    return _.merge(where, this.where)
  }

  public transformToShow(additionalFilters?: AdditionalFilterType[]) {
    let res = [...this.fields]

    if (additionalFilters?.length) {
      res = res.concat(
        additionalFilters.map(({ availableOperators, filterName }) => [
          filterName,
          availableOperators,
        ]),
      )
    }

    return res.map(
      ([
        name,
        operators,
      ]) => ({
        name: this.filtersName.get(name) ?? name,
        operators,
      }),
    )
  }
}

export const filteringAndMaping = <T, V>(
  targetArray: T[],
  filter: (item: T) => boolean,
  mapper: (item: T) => V,
): V[] => {
  return targetArray.filter(filter).map(mapper)
}
