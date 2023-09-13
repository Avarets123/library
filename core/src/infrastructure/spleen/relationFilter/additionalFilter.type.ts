export type SpleenBetweenValueType = { lower: any; upper: any }

export type FilterDataType = {
  relation: string
  field: string
  value: string | SpleenBetweenValueType
  operator: string
  where: Function
}

export type AdditionalFilterType = Pick<
  FilterDataType,
  'field' | 'relation'
> & {
  filterName: string
  availableOperators: string[]
  where: Function
}

export type ConditionsBuilderFn = (filter: FilterDataType) => any
