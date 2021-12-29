import { createContext } from 'react'

import { ParseResult } from 'papaparse'

interface StateContext {
  file: Nullable<File>
  csv: Nullable<ParseResult<unknown>>
}

export const Context = createContext<StateContext>({
  file: null,
  csv: null
})
