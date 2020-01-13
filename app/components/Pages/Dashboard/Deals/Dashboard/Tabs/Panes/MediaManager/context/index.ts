import { createContext } from 'react'
import { IMediaManagerAPI } from '../types'

export const MediaManagerAPI = createContext<IMediaManagerAPI>({
  state: [],
  dispatch: () => {}
})
