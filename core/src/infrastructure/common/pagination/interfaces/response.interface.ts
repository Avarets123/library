export interface Response {
  limit: number
  page: number
  total: number
  data: Record<string, any>[]
  $aggregations: Record<string, any>
  filters?: { name: string; operators: string[] }[]
}
