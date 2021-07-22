import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { selectActiveTeamUnsafe } from 'selectors/team'

function useActiveTeamBrandWithPermission(
  permission: IPermission
): Optional<IBrand> {
  const activeTeam = useSelector(selectActiveTeamUnsafe)?.brand

  return useMemo<Optional<IBrand>>(
    () =>
      activeTeam
        ? {
            ...activeTeam,
            roles: activeTeam.roles?.filter(role =>
              role.acl.includes(permission)
            )
          }
        : undefined,
    [activeTeam, permission]
  )
}

export default useActiveTeamBrandWithPermission
