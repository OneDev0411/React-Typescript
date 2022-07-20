import { createContext } from 'react'

import Pikaso, { Filters } from 'pikaso'

import type { Actions } from '../types'

interface Context {
  editor: Pikaso | null
  activeAction: Nullable<Actions>
  activeFilter: Nullable<Filters>
  setActiveAction: (action: Nullable<Actions>) => void
  setActiveFilter: (filter: Nullable<Filters>) => void
}

export const ImageEditorContext = createContext<Context>({
  editor: null,
  activeAction: null,
  activeFilter: null,
  setActiveAction: () => {},
  setActiveFilter: () => {}
})
