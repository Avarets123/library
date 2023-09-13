import { SpleenOperatorsEnum } from '../enums/operators.enum'
import { AdditionalFilterType } from './additionalFilter.type'

export const makefilter = (
  filterName: string,
  field: string,
  relation: string,
  where: Function,
): AdditionalFilterType => {
  return {
    filterName,
    availableOperators: [
      SpleenOperatorsEnum.EQ,
      SpleenOperatorsEnum.NEQ,
      SpleenOperatorsEnum.IN,
      SpleenOperatorsEnum.NIN,
      SpleenOperatorsEnum.BETWEEN,
    ],
    field,
    relation,
    where,
  }
}
