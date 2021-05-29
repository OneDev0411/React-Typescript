import React from 'react'
import { IconButton } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ContextField } from '../../types'

interface Props {
  value: unknown
  field: ContextField
  deal: IDeal
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export function DeleteButton(props: Props) {
  const hasValue = props.value || props.value === 0
  const isRequired = props.field.mandatory && !props.deal.is_draft

  if (isRequired || !hasValue) {
    return null
  }

  return (
    <IconButton size="small" onClick={props.onClick}>
      <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
    </IconButton>
  )
}
