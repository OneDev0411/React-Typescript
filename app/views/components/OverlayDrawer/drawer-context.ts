import { createContext, useContext } from 'react'

import { DrawerContextType } from './types'

export const useDrawerContext = () => useContext(DrawerContext)

export const DrawerContext = createContext<DrawerContextType | null>(null)
