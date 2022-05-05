import { createContext } from 'react'

import Pikaso from 'pikaso'

import type { Actions } from '../types'

interface Context {
  editor: Pikaso | null
  activeAction: Nullable<Actions>
  setActiveAction: (action: Nullable<Actions>) => void
}

export const ImageEditorContext = createContext<Context>({
  editor: null,
  activeAction: null,
  setActiveAction: () => {}
})
