import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { ACL } from 'constants/acl'
import { selectActiveTeamUnsafe } from 'selectors/team'

function useActiveTeamBrandWithShowingsPermission(): Optional<IBrand> {
  const activeTeam = useSelector(selectActiveTeamUnsafe)?.brand

  return useMemo<Optional<IBrand>>(
    () =>
      activeTeam
        ? {
            ...activeTeam,
            roles: activeTeam.roles?.filter(role =>
              role.acl.includes(ACL.SHOWINGS)
            )
          }
        : undefined,
    [activeTeam]
  )
}

export default useActiveTeamBrandWithShowingsPermission
