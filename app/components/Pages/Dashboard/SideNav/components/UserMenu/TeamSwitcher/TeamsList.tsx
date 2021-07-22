import React, { useState, useMemo } from 'react'

import { Box, Divider } from '@material-ui/core'

import { putUserSetting } from '../../../../../../../models/user/put-user-setting'
import { isFetchingSelectedTeam } from '../../../../../../../reducers/user'
import { viewAs, getActiveTeamId } from '../../../../../../../utils/user-teams'
import Loading from '../../../../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { TeamItem } from './TeamItem'

interface SwitcherStatus {
  isSwitching: boolean
  switchedTeamId: UUID
}
interface Props {
  user: IUser
}

export function TeamsList({ user }: Props) {
  const [switcherStatus, setSwitcherStatus] = useState<SwitcherStatus>({
    isSwitching: false,
    switchedTeamId: ''
  })

  const activeTeamId = useMemo(() => getActiveTeamId(user), [user])

  const onClickTeam = async (teamId: string) => {
    setSwitcherStatus({
      isSwitching: true,
      switchedTeamId: teamId
    })

    await putUserSetting('user_filter', viewAs(user, true), teamId)

    window.location.reload(true)
  }

  if (isFetchingSelectedTeam(user)) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Loading />
        </Box>
        <Divider role="separator" />
      </>
    )
  }

  if (user && user.teams && user.teams.length > 0) {
    return (
      <>
        {user.teams.map(team => {
          const teamId = team.brand.id

          return (
            <TeamItem
              key={team.id}
              disabled={switcherStatus.isSwitching}
              isSwitching={switcherStatus.switchedTeamId === teamId}
              onClick={() => onClickTeam(teamId)}
              selected={teamId === activeTeamId}
              team={team}
            />
          )
        })}
        <Divider role="separator" />
      </>
    )
  }

  return null
}
