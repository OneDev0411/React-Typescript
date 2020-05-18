import React, { useState, useCallback, useMemo } from 'react'
import idx from 'idx/lib/idx'
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@material-ui/core'

import { putUserSetting } from '../../../../../../../models/user/put-user-setting'

import flattenBrand from '../../../../../../../utils/flatten-brand'
import Loading from '../../../../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { viewAs, getActiveTeamId } from '../../../../../../../utils/user-teams'
import { selectTeamIsFetching } from '../../../../../../../reducers/user'

import ViewAsFilter from './ViewAsFilter'
import { ListItemDivider } from '../../../styled'

export function TeamSwitcher({ user }) {
  const [switchingTeam, setSwitchingTeam] = useState('')

  const activeTeamId = useMemo(() => getActiveTeamId(user), [user])

  const getTeamNameInitial = useCallback(brand => {
    const flatted = flattenBrand(brand)

    return flatted.name.charAt(0).toUpperCase()
  }, [])

  const onClickTeam = async team => {
    const teamId = team.brand.id

    setSwitchingTeam(teamId)

    await putUserSetting('user_filter', viewAs(user), teamId)

    window.location.reload(true)
  }

  const renderTeam = team => {
    const isActiveTeam = team.brand.id === activeTeamId

    return (
      <>
        <ListItem
          button
          key={team.brand.id}
          disabled={switchingTeam}
          selected={isActiveTeam}
          onClick={() => onClickTeam(team)}
        >
          <ListItemAvatar>
            <Avatar>{getTeamNameInitial(team.brand)}</Avatar>
          </ListItemAvatar>
          <Tooltip title={team.brand.name}>
            <ListItemText primaryTypographyProps={{ noWrap: true }}>
              {team.brand.name}
            </ListItemText>
          </Tooltip>
          {switchingTeam === team.brand.id && (
            <Loading style={{ width: '2.25rem', height: '2.25rem' }} />
          )}
        </ListItem>
        <ViewAsFilter team={team} isActive={isActiveTeam} />
      </>
    )
  }

  if (selectTeamIsFetching(user)) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Loading />
        </Box>
        <ListItemDivider role="separator" />
      </>
    )
  }

  if (idx(user, u => u.teams[0].brand.roles)) {
    return user.teams.map(renderTeam)
  }

  return null
}

export default TeamSwitcher
