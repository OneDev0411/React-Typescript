import { ReactNode } from 'react'

import { SocialDrawerContext } from './context'
import { SocialDrawerStep } from './types'

interface SocialDrawerProviderProps {
  setStep: (step: SocialDrawerStep) => void
  children: ReactNode
}

function SocialDrawerProvider({
  setStep,
  children
}: SocialDrawerProviderProps) {
  return (
    <SocialDrawerContext.Provider value={setStep}>
      {children}
    </SocialDrawerContext.Provider>
  )
}

export default SocialDrawerProvider
