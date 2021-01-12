import { useContext } from 'react'

import { Context } from '.'

export function useFormContext() {
  const context = useContext(Context)

  return context!
}
