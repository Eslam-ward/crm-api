import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function IsPhoneNumberEGorSA(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberEGorSA',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;

          const phone = parsePhoneNumberFromString(value);

          if (!phone || !phone.isValid()) return false;

          return phone.country === 'EG' || phone.country === 'SA';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid phone number from Egypt (EG) or Saudi Arabia (SA)`;
        },
      },
    });
  };
}