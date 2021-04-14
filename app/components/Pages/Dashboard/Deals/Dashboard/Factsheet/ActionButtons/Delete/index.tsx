import React from 'react'
import { IconButton, Theme, useTheme } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { isRequiredContext } from 'models/Deal/helpers/brand-context/is-required-context'

interface Props {
  value: unknown
  field: IDealBrandContext
  deal: IDeal
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export function DeleteButton({ value, field, deal, onClick }: Props) {
  const theme = useTheme<Theme>()

  const hasValue = value || value === 0
  const isRequired = isRequiredContext(deal, field.key) && !deal.is_draft

  if (isRequired || !hasValue) {
    return null
  }

  return (
    <IconButton size="small" onClick={onClick}>
      <SvgIcon
        path={mdiTrashCanOutline}
        color={theme.palette.error.main}
        size={muiIconSizes.small}
      />
    </IconButton>
  )
}
