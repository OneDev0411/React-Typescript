import React, { ReactNode } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'

interface Props {
  children: ReactNode
  disabled: boolean
  Icon: ReactNode
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
          {Icon}
        </IconButton>
      </Tooltip>
      {children}
    </div>
  )
}
