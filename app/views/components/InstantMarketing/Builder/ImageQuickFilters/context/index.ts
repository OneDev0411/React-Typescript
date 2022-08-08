import { createContext } from 'react'

import Pikaso from 'pikaso'

export interface FilterContext {
  editor: Nullable<Pikaso>
  updateImage: () => void
}

export const Context = createContext<FilterContext | undefined>(undefined)
