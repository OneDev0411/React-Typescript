import { createContext } from 'react'

import { SocialDrawerStep } from './types'

export const SocialDrawerContext =
  createContext<Nullable<(step: SocialDrawerStep) => void>>(null)
