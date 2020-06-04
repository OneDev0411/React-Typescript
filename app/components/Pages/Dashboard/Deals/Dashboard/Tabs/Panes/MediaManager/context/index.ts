import { createContext } from 'react'

import { IMediaManagerContext } from '../types'

export const MediaManagerContext = createContext<IMediaManagerContext>({
  state: [],
  dispatch: () => {}
})
