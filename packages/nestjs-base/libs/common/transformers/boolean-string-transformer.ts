import { Transform } from 'class-transformer';

export function BooleanStringTransformer() {
  return Transform(({ value }) => {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  });
}
