import React, { MouseEventHandler, ReactNode } from 'react'
import { IconButtonProps } from '@material-ui/core/IconButton'

import { Tooltip } from '@material-ui/core'

import { ToolbarIconButton } from '../ToolbarIconButton'

interface Props extends Omit<IconButtonProps, 'type'> {
  isBlockButton?: boolean
  toggleBlockType?: MouseEventHandler<'button'>
  toggleInlineStyle?: MouseEventHandler<'button'>
  isActive?: boolean
  tooltip?: ReactNode
  children: ReactNode
}

export function ToolbarToggleButton({
  toggleBlockType = () => {},
  toggleInlineStyle = () => {},
  isActive,
  tooltip,
  ...props
}: Props) {
  const onClick = e =>
    props.isBlockButton ? toggleBlockType(e) : toggleInlineStyle(e)

  // NOTE: type="button" is required because default type is "submit"
  // and this causes unwanted form submission if the text editor component
  // is used inside a form
  const btn = (
    <ToolbarIconButton
      type="button"
      onClick={onClick}
      color={isActive ? 'secondary' : undefined}
      {...props}
    >
      {props.children}
    </ToolbarIconButton>
  )

  return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn
}
