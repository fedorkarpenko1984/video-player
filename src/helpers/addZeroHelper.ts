export default (number: number, stringLength: number): string => {
  if (stringLength - number.toString().length === 1) return '0' + number.toString()
  if (stringLength - number.toString().length === 2) return '00' + number.toString()
  return number.toString()
}