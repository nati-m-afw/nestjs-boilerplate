import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

export function IsDateRange(validationOptions?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsDateRange',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments): boolean {
          // eslint-disable-next-line dot-notation
          const startDate = args.object['startDate']

          return value >= startDate
        },
        defaultMessage(): string {
          return 'End date must be greater than start date'
        },
      },
    })
  }
}
