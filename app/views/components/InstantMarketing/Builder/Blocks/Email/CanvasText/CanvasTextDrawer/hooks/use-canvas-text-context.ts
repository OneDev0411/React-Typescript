import { useContext } from 'react'

import { CanvasTextContext, Context } from '../context'

export function useCanvasTextContext() {
  return useContext(Context) as CanvasTextContext
}
