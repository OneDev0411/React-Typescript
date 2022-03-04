import { createContext } from 'react'

import { ParseResult } from 'papaparse'

import { MappedField } from '../types'

interface StateContext {
  file: Nullable<File>
  csv: Nullable<ParseResult>
  owner: Nullable<IUser>
  mappedFields: Record<string, Nullable<MappedField>>
}

export const Context = createContext<StateContext>({
  file: null,
  csv: null,
  owner: null,
  mappedFields: {}
})
