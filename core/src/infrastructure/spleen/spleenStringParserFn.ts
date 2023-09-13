import { parse } from 'spleen'

export type SpleenFilterObjType = {
  field: string
  operator: string
  value: any
}

export const spleenStringParserFn = (input: string): SpleenFilterObjType[] => {
  if (!input) return []

  return parse(input).value.statements.map((el) => {
    const field = el.value.subject.path[0]
    const operator = el.value.operator.type
    const value = el.value.object

    return {
      field,
      operator,
      value,
    }
  })
}
