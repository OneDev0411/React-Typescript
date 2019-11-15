import React from 'react'
import { IconButton } from '@material-ui/core'

import IconDelete from 'components/SvgIcons/Trash/TrashIcon'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { ContextField } from '../../types'

interface Props {
  value: unknown
  field: ContextField
  deal: IDeal
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export function DeleteButton(props: Props) {
  const iconClassess = useIconStyles()

  const hasValue = props.value || props.value === 0
  const isRequired = props.field.mandatory && !props.deal.is_draft

  if (isRequired || !hasValue) {
    return null
  }

  return (
    <IconButton
      size="small"
      className={iconClassess.leftMargin}
      onClick={props.onClick}
    >
      <IconDelete className={iconClassess.small} />
    </IconButton>
  )
}
