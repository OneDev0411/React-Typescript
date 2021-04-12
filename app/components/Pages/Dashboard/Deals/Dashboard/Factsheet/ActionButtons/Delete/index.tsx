import React from 'react'
import { IconButton, Theme, useTheme } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

interface Props {
  value: unknown
  field: IDealBrandContext
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
      <SvgIcon
        path={mdiTrashCanOutline}
        color={theme.palette.error.main}
        size={muiIconSizes.small}
      />
    </IconButton>
  )
}
