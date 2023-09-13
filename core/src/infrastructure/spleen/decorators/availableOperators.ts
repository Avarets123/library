import { SpleenOperatorsEnum } from '../enums/operators.enum'
import { SpleenOperatorsTypeEnum } from '../enums/operatorsType.enum'

const DEFAULT_OPERATORS: SpleenOperatorsEnum[] = [
  SpleenOperatorsEnum.EQ,
  SpleenOperatorsEnum.NEQ,
  SpleenOperatorsEnum.IN,
  SpleenOperatorsEnum.NIN,
  SpleenOperatorsEnum.LIKE,
  SpleenOperatorsEnum.NLIKE,
]

const ALL_OPERATORS: SpleenOperatorsEnum[] = [
  SpleenOperatorsEnum.EQ,
  SpleenOperatorsEnum.NEQ,
  SpleenOperatorsEnum.IN,
  SpleenOperatorsEnum.NIN,
  SpleenOperatorsEnum.LIKE,
  SpleenOperatorsEnum.NLIKE,
  SpleenOperatorsEnum.GT,
  SpleenOperatorsEnum.GTE,
  SpleenOperatorsEnum.LT,
  SpleenOperatorsEnum.LTE,
  SpleenOperatorsEnum.BETWEEN,
  SpleenOperatorsEnum.NBETWEEN,
]

const BOOLEAN_OPERATORS: SpleenOperatorsEnum[] = [
  SpleenOperatorsEnum.EQ,
  SpleenOperatorsEnum.NEQ,
]

const DATE_OPERATORS: SpleenOperatorsEnum[] = [
  SpleenOperatorsEnum.EQ,
  SpleenOperatorsEnum.NEQ,
  SpleenOperatorsEnum.GT,
  SpleenOperatorsEnum.GTE,
  SpleenOperatorsEnum.LT,
  SpleenOperatorsEnum.LTE,
  SpleenOperatorsEnum.BETWEEN,
  SpleenOperatorsEnum.NBETWEEN,
]

const mapSpleenOperators: Map<SpleenOperatorsTypeEnum, SpleenOperatorsEnum[]> =
  new Map()

mapSpleenOperators
  .set(SpleenOperatorsTypeEnum.ALL_OPERATORS, ALL_OPERATORS)
  .set(SpleenOperatorsTypeEnum.DEFAULT_OPERATORS, DEFAULT_OPERATORS)
  .set(SpleenOperatorsTypeEnum.BOOLEAN_OPERATORS, BOOLEAN_OPERATORS)
  .set(SpleenOperatorsTypeEnum.DATE_OPERATORS, DATE_OPERATORS)

export const getOperators = (type: SpleenOperatorsTypeEnum) =>
  mapSpleenOperators.get(type)
