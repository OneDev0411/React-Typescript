import { useState } from 'react'

import { useEffectOnce } from 'react-use'

import { getDefinitions } from '@app/models/Deal/role'

export function useDealsRolesDefinitions(): [IDealRoleDefinition[], boolean] {
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<IDealRoleDefinition[]>([])

  useEffectOnce(() => {
    const load = async () => {
      try {
        setIsLoading(true)

        const roles = await getDefinitions()

        setRoles(roles)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  })

  return [roles, isLoading]
}
