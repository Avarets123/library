import { Injectable } from '@nestjs/common'
import { parse, Filter, Clause } from 'spleen'

@Injectable()
export class SpleenParser {
  private where

  constructor() {
    this.where = {}
  }

  private buildWhere(filter: Filter | Clause, availableFields: string[]) {
    let where = {}

    if (filter instanceof Filter) {
      const statements = filter.statements
      const arr = []
      let conjunctive = 'AND'
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].value
        const subQuery = this.buildWhere(statement, availableFields)
        arr.push(subQuery)
        if (statements[i].conjunctive) {
          conjunctive = statements[i].conjunctive
        }
      }
      if (arr.length > 0) {
        if (arr.length === 1) {
          where = arr[0]
        } else {
          where[conjunctive.toUpperCase()] = arr
        }
      }
    } else if (filter instanceof Clause) {
      const subject = filter.subject.path[0]
      const operator = filter.operator.type
      const object = filter.object
      const key = subject

      if (availableFields.includes(key)) {
        switch (operator) {
          case 'eq':
            where[key] = object
            break
          case 'neq':
            where[key] = { not: object }
            break
          case 'gt':
            where[key] = { gt: object }
            break
          case 'gte':
            where[key] = { gte: object }
            break
          case 'lt':
            where[key] = { lt: object }
            break
          case 'lte':
            where[key] = { lte: object }
            break
          case 'in':
            where[key] = { in: object }
            break
          case 'nin':
            where[key] = { not: { in: object } }
            break
          case 'between':
            where[key] = { gte: object.upper, lte: object.lower }
            break
          case 'nbetween':
            where[key] = { not: { gte: object.upper, lte: object.lower } }
            break
          case 'like':
            where[key] = {
              contains: object.value.replace(/\*/g, '%'),
              mode: 'insensitive',
            }
            break
          case 'nlike':
            where[key] = { not: { contains: object.value.replace(/\*/g, '%') } }
            break
          default:
            break
        }
      }
    }

    return where
  }

  build(input: string, availableFields?: string[]) {
    if (!input) return

    const ast = parse(input)

    this.where = this.buildWhere(ast.value, availableFields)

    return this.where
  }
}
