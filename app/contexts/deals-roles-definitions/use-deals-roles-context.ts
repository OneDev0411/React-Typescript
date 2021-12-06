import { useContext } from 'react'

import { Context } from './context'

export function useDealsRolesContext() {
  const { roles } = useContext(Context)

  return roles
}
