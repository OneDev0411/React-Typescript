import { useContext } from 'react'

import { Context } from '../../context'

export function useImportCsv() {
  const context = useContext(Context)

  return context
}
