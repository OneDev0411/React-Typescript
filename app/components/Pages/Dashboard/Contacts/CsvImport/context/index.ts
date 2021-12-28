import { createContext } from 'react'

import { ParseResult } from 'papaparse'

import type { IAttribute } from '../types'

interface StateContext {
  file: Nullable<File>
  csv: Nullable<ParseResult<unknown>>
  attributes: IAttribute[]
}

export const Context = createContext<StateContext>({
  file: null,
  csv: null,
  attributes: []
})
