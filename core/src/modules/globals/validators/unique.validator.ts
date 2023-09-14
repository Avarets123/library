import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/services/prisma.service'
import { Prisma } from '@prisma/client'

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [
      model,
      property,
    ] = args.constraints as [Prisma.ModelName, string]

    if (!value || !model) return false

    const record = await this.prisma[model].findUnique({
      where: {
        [property]: value,
      },
    })

    if (!record) return true

    

    return false
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`
  }
}

export function Unique(
  model: string,
  uniqueField: string,
  exceptField: string = null,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        model,
        uniqueField,
      ],
      validator: UniqueConstraint,
    })
  }
}
