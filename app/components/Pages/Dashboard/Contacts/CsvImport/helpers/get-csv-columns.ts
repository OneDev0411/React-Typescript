import { ParseResult } from 'papaparse'

export function getCsvColumns(csv: Nullable<ParseResult>): string[] {
  return (csv ? csv?.data[0] : []) as string[]
}
