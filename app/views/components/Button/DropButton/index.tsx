import React from 'react'

import Button, { ButtonProps } from '@material-ui/core/Button'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface Props
  extends Pick<
    ButtonProps,
    'disabled' | 'style' | 'size' | 'variant' | 'onClick'
  > {
  text: string
  isOpen: boolean
}

export function DropButton({
  isOpen,
  onClick,
  disabled = false,
  size = 'medium',
  style,
  variant = 'outlined',
  text
}: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      style={style}
      variant={variant}
      endIcon={
        isOpen ? (
          <SvgIcon path={mdiChevronUp} />
        ) : (
          <SvgIcon path={mdiChevronDown} />
        )
      }
    >
      {text}
    </Button>
  )
}

export default DropButton
