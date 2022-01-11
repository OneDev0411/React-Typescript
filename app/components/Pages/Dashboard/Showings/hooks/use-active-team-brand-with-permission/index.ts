import { useMemo } from 'react'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'

function useActiveTeamBrandWithPermission(
  permission: IPermission
): Optional<IBrand> {
  const activeBrand = useUnsafeActiveBrand()

  return useMemo<Optional<IBrand>>(
    () =>
      activeBrand
        ? {
            ...activeBrand,
            roles: (activeBrand.roles || []).filter(role =>
              role.acl.includes(permission)
            )
          }
        : undefined,
    [activeBrand, permission]
  )
}

export default useActiveTeamBrandWithPermission
