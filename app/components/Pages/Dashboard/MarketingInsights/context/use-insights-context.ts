import { useContext } from 'react'

import { InsightsContext, Context } from '.'

export function useInsightsContext() {
  return useContext(Context) as InsightsContext
}
