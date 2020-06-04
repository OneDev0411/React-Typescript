import React from 'react'
import { Typography } from '@material-ui/core'

import { BadgeContainer } from './styled'

interface BadgeProps {
  count: number
}

function SideNavBadge(props: BadgeProps) {
  return (
    <BadgeContainer>
      <Typography variant="body2">{props.count}</Typography>
    </BadgeContainer>
  )
}

export default SideNavBadge
