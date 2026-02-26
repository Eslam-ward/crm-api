import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsValidator implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  async validate(id: string, args: ValidationArguments) {
      if (!Types.ObjectId.isValid(id)) {
    return false;
  }
     const model = this.connection.model(args.constraints[0]);

  const exists = await model.exists({ _id: id });

  return !!exists;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.constraints[0]} not found`;
  }
}

export function Exists(model: string, options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [model],
      validator: ExistsValidator,
    });
  };
}