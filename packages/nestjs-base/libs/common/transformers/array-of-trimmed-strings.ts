import { Transform } from 'class-transformer';

export function ArrayOfTrimmedStrings() {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      const trimmed = (value as Array<string>).map((element) => element.trim());
      return trimmed;
    } else {
      return value;
    }
  });
}
