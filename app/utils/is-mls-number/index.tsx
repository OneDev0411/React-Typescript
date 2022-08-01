/**
 * The aim of this function is detecting that the given input is an
 * mls number or not. it covers many of the scenarios but it might the
 * function not able to detect all of them
 *
 * @param input The input string
 * @returns a boolean that indicates the input is mls number or not
 */
export function isMlsNumber(input: string): boolean {
  if (input.trim().includes(' ')) {
    return false
  }

  if (/\d+/.test(input) || /\w+-?\d+/.test(input) || /\d+-?\w+/.test(input)) {
    return true
  }

  return false
}
