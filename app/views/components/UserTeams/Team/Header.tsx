import React from 'react'
import { Typography } from '@material-ui/core'
import pluralize from 'pluralize'

import { Checkbox } from 'components/Checkbox'

import { HeaderContainer, ItemDetailsContainer } from './styled'

interface Props {
  brand: IBrand
  membersCount: number
  isSelected: boolean
  onSelectChange: (brand: IBrand) => void
}

export default function Header({
  brand,
  membersCount,
  onSelectChange,
  isSelected
}: Props) {
  return (
    <HeaderContainer onClick={() => onSelectChange(brand)}>
      <ItemDetailsContainer>
        <Checkbox checked={isSelected} />
      </ItemDetailsContainer>
      <ItemDetailsContainer>
        <Typography variant="body1">{brand.name}</Typography>
        <Typography variant="body2">
          {pluralize('member', membersCount, true)}
        </Typography>
      </ItemDetailsContainer>
    </HeaderContainer>
  )
}
