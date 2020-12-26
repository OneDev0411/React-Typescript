import React, { ReactNode } from 'react'
import { ButtonBase, Tooltip } from '@material-ui/core'

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
        <ButtonBase disabled={disabled} onClick={onClick}>
          {Icon}
        </ButtonBase>
      </Tooltip>
      {children}
    </div>
  )
}
