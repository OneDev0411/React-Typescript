import React, { useCallback } from 'react'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@material-ui/core'

import flattenBrand from '../../../../../../../utils/flatten-brand'
import Loading from '../../../../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import ViewAsFilter from './ViewAsFilter'

interface Props {
  isSwtching: boolean
  onClick: (team: IUserTeam) => Promise<void>
  selected: boolean
  team: IUserTeam
}

export function TeamItem({ isSwitching, onClick, selected, team }) {
  const getTeamNameInitial = useCallback(brand => {
    const flatted = flattenBrand(brand)

    if (flatted) {
      return flatted.name.charAt(0).toUpperCase()
    }

    return ''
  }, [])

  return (
    <>
      <ListItem
        button
        disabled={isSwitching}
        selected={selected}
        onClick={onClick}
      >
        <ListItemAvatar>
          <Avatar>{getTeamNameInitial(team.brand)}</Avatar>
        </ListItemAvatar>
        <Tooltip title={team.brand.name}>
          <ListItemText primaryTypographyProps={{ noWrap: true }}>
            {team.brand.name}
          </ListItemText>
        </Tooltip>
        {isSwitching && (
          <Loading style={{ width: '2.25rem', height: '2.25rem' }} />
        )}
      </ListItem>
      <ViewAsFilter team={team} isActive={selected} />
    </>
  )
}
