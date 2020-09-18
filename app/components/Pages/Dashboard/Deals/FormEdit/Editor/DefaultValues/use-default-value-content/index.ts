import { useContext } from 'react'

import { DefaultValuesContext } from '../context'

export function useDefaultValueContext() {
  return useContext(DefaultValuesContext)
}
