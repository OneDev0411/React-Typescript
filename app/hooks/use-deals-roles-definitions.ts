import { useState } from 'react'

import { useEffectOnce } from 'react-use'

import Fetch from '@app/services/fetch'

export function useDealsRolesDefinitions(): [IDealRoleDefinition[], boolean] {
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<IDealRoleDefinition[]>([])

  useEffectOnce(() => {
    const load = async () => {
      try {
        setIsLoading(true)

        const { body } = await new Fetch().get('/deals/roles/definitions')

        setRoles(body.data)
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
