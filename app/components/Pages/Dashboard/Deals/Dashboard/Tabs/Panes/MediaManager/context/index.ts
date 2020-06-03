import { createContext } from 'react'

export const MediaManagerContext = createContext<IMediaManagerContext>({
  state: [],
  dispatch: () => {}
})
