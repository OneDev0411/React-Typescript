import React, { ReactNode } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'

import { StyledSVGWithProps } from 'utils/ts-utils'

interface Props {
  children: ReactNode
  disabled: boolean
  Icon: StyledSVGWithProps<{}>
  onClick: () => void
  title: string
}

export function AddAssociationButton({
  children,
  disabled,
  Icon,
  onClick,
  title
}: Props) {
  return (
    <div>
      <Tooltip title={title}>
        <IconButton
          disabled={disabled}
          onClick={onClick}
          style={{ marginRight: '0.5rem' }}
        >
          <Icon />
        </IconButton>
      </Tooltip>
      {children}
    </div>
  )
}
