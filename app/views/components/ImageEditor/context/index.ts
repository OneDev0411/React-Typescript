import { createContext } from 'react'

import Pikaso from 'pikaso'

import type { Filter } from '@app/hooks/use-image-filters'

import type { Actions, HistoryEvent } from '../types'

interface Context {
  editor: Pikaso | null
  history: Nullable<HistoryEvent['data']>
  activeAction: Nullable<Actions>
  activeFilter: Nullable<Filter>
  setActiveAction: (action: Nullable<Actions>) => void
  setActiveFilter: (filter: Nullable<Filter>) => void
}

export const ImageEditorContext = createContext<Context>({
  editor: null,
  activeAction: null,
  activeFilter: null,
  history: null,
  setActiveAction: () => {},
  setActiveFilter: () => {}
})
