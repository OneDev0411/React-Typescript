import React from 'react'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import Button from '@material-ui/core/Button'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface Props {
  text: string
  isOpen: boolean
  disabled?: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  buttonVariant?: 'contained' | 'outlined' | 'text'
  buttonSize?: 'small' | 'medium' | 'large'
  style?: object
}

export function DropButton({
  isOpen,
  onClick,
  disabled = false,
  buttonSize = 'medium',
  style,
  buttonVariant = 'outlined',
  text
}: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={buttonSize}
      style={style}
      variant={buttonVariant}
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
