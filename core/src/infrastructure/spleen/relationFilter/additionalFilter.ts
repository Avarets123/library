import { SpleenOperatorsEnum } from '../enums/operators.enum'
import {
  ConditionsBuilderFn,
  FilterDataType,
  SpleenBetweenValueType,
} from './additionalFilter.type'
import * as _ from 'lodash'

export const applyAdditionalFilter = (
  where: object,
  cb: ConditionsBuilderFn,
) => {
  return (filter: FilterDataType) => {
    _.merge(where, cb(filter))
  }
}

export const buildRelationQuery = (filter: FilterDataType) => {
  const { field, relation, operator, value, where } = filter
  switch (operator) {
    case SpleenOperatorsEnum.EQ:
      return getRelationQuery(relation, field, value, where)

    case SpleenOperatorsEnum.NEQ:
      return getRelationQueryByNeq(relation, field, value, where)

    case SpleenOperatorsEnum.IN:
      return getRelationQuery(relation, field, { in: value }, where)

    case SpleenOperatorsEnum.NIN:
      return getRelationQuery(relation, field, { not: { in: value } }, where)

    case SpleenOperatorsEnum.BETWEEN:
      const { lower, upper } = value as SpleenBetweenValueType

      return getRelationQuery(
        relation,
        field,
        {
          gte: upper,
          lte: lower,
        },
        where,
      )

    default:
      return undefined
  }
}

const getRelationQuery = (
  relation: string,
  field: string,
  value: any,
  where: Function,
) => {
  const obj = {}
  if (where) {
    obj[relation] = {
      ...where(field, value),
    }
  } else {
    obj[relation] = {
      none: {
        [field]: value,
      },
    }
  }

  if (value === null) obj[relation] = { none: {} }

  return obj
}

const getRelationQueryByNeq = (
  relation: string,
  field: string,
  value: any,
  where: Function,
) => {
  const obj = {}
  if (where) {
    obj[relation] = {
      ...where(field, value),
    }
  } else {
    obj[relation] = {
      none: {
        [field]: value,
      },
    }
  }

  if (value === null) obj[relation] = { some: {} }

  return obj
}
