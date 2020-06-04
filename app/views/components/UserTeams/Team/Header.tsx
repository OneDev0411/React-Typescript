import React from 'react'
import { Typography } from '@material-ui/core'
import pluralize from 'pluralize'

import { Checkbox } from 'components/Checkbox'
import { TextWithHighlights } from 'components/TextWithHighlights'

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
  isSelected,
  onSelectChange
}: Props) {
  return (
    <HeaderContainer onClick={() => onSelectChange(brand)}>
      <ItemDetailsContainer>
        <Checkbox checked={isSelected} />
      </ItemDetailsContainer>
      <ItemDetailsContainer>
        <Typography variant="body1">
          <TextWithHighlights>{brand.name}</TextWithHighlights>
        </Typography>
        <Typography variant="body2">
          {pluralize('member', membersCount, true)}
        </Typography>
      </ItemDetailsContainer>
    </HeaderContainer>
  )
}
