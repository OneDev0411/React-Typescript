import React from 'react'
import { IconButton, Theme, useTheme } from '@material-ui/core'

import IconDelete from 'components/SvgIcons/Trash/TrashIcon'

import { ContextField } from '../../types'

interface Props {
  value: unknown
  field: ContextField
  deal: IDeal
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export function DeleteButton(props: Props) {
  const theme = useTheme<Theme>()

  const hasValue = props.value || props.value === 0
  const isRequired = props.field.mandatory && !props.deal.is_draft

  if (isRequired || !hasValue) {
    return null
  }

  return (
    <IconButton size="small" onClick={props.onClick}>
      <IconDelete size="small" fillColor={theme.palette.error.main} />
    </IconButton>
  )
}
