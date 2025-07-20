import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom decorator to validate that two fields match.
 * Commonly used for confirming password or email fields.
 *
 * @param property - The name of the property to compare with.
 * @param validationOptions - Optional validation options (e.g., custom error message).
 */
export function Match(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'match', // Name of the custom validator
      target: object.constructor, // Target class where the decorator is used
      propertyName: propertyName, // Name of the property to validate
      options: validationOptions, // Additional options like custom error message
      constraints: [property], // Field that should match
      validator: {
        /**
         * Validation logic: checks if the current value matches the related property's value.
         */
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },

        /**
         * Default error message if the validation fails.
         */
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}
