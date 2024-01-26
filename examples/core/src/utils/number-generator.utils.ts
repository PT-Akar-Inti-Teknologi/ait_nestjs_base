export function generatePrimary(number: number) {
  const stringNumber = number.toString();

  const digit = '00000';

  return `${digit.substring(
    0,
    digit.length - stringNumber.length,
  )}${stringNumber}`;
}
