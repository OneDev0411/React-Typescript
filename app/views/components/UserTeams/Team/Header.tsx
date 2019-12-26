import React from 'react'
import { Typography } from '@material-ui/core'
import pluralize from 'pluralize'

import { Checkbox } from 'components/Checkbox'

import { HeaderContainer, ItemDetailsContainer } from './styled'

interface Props {
  team: IUserTeam
  membersCount: number
  isSelected: boolean
  onSelectChange: (team: IUserTeam) => void
}

export default function Header({
  team,
  membersCount,
  onSelectChange,
  isSelected
}: Props) {
  return (
    <HeaderContainer onClick={() => onSelectChange(team)}>
      <ItemDetailsContainer>
        <Checkbox checked={isSelected} />
      </ItemDetailsContainer>
      <ItemDetailsContainer>
        <Typography variant="body1">{team.brand.name}</Typography>
        <Typography variant="body2">
          {pluralize('members', membersCount, true)}
        </Typography>
      </ItemDetailsContainer>
    </HeaderContainer>
  )
}
