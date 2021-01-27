import { useContext } from 'react'

import { Context } from '.'

export function useCreationContext() {
  const context = useContext(Context)

  return context!
}
