import { useContext } from 'react'

import { Context } from './context'

export function useDealsRolesContext() {
  const { list, byName } = useContext(Context)

  return { dealRolesList: list, dealRolesByName: byName }
}
