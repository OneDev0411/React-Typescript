import { useContext } from 'react'

import { SocialDrawerContext } from './context'

export function useSetSocialDrawerStep() {
  const context = useContext(SocialDrawerContext)

  if (!context) {
    throw new Error(
      'The useSetSocialDrawerStep hook must be used within a SocialDrawerContext'
    )
  }

  return context
}
